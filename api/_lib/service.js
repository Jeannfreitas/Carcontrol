// Regras de negócio da portaria. Recebe `db` (tagged template do Neon) por parâmetro,
// o que permite testar com outro driver.

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const normalizePlate = (value = '') =>
  String(value).toUpperCase().replace(/[^A-Z0-9]/g, '')

const iso = (value) => (value instanceof Date ? value.toISOString() : value ?? null)

function toMovement(row) {
  return {
    id: row.id,
    plate: row.plate,
    model: row.model,
    color: row.color,
    driver: row.driver,
    company: row.company ?? null,
    observation: row.observation ?? null,
    entryAt: iso(row.entry_at),
    exitAt: iso(row.exit_at),
  }
}

function required(body, field, label, max) {
  const value = typeof body[field] === 'string' ? body[field].trim() : ''
  if (!value) throw new HttpError(400, `${label} é obrigatório.`)
  if (value.length > max) throw new HttpError(400, `${label} deve ter no máximo ${max} caracteres.`)
  return value
}

function optional(body, field, label, max) {
  const raw = body[field]
  if (raw == null) return null
  if (typeof raw !== 'string') throw new HttpError(400, `${label} inválido.`)
  const value = raw.trim()
  if (value.length > max) throw new HttpError(400, `${label} deve ter no máximo ${max} caracteres.`)
  return value || null
}

export function validateMovement(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Dados inválidos.')
  }
  const plate = normalizePlate(typeof body.plate === 'string' ? body.plate : '')
  if (!plate) throw new HttpError(400, 'Placa é obrigatória.')
  if (!PLATE_REGEX.test(plate)) throw new HttpError(400, 'Placa inválida')
  return {
    plate,
    model: required(body, 'model', 'Modelo', 40),
    color: required(body, 'color', 'Cor', 40),
    driver: required(body, 'driver', 'Motorista', 60),
    company: optional(body, 'company', 'Empresa', 80),
    observation: optional(body, 'observation', 'Observação', 300),
  }
}

export async function listMovements(db, plate) {
  const term = plate ? normalizePlate(plate) : ''
  const rows = term
    ? await db`select * from movements where plate ilike ${'%' + term + '%'} order by entry_at desc`
    : await db`select * from movements order by entry_at desc`
  return rows.map(toMovement)
}

export async function listPresent(db) {
  const rows = await db`select * from movements where exit_at is null order by entry_at desc`
  return rows.map(toMovement)
}

export async function createMovement(db, body) {
  const m = validateMovement(body)
  try {
    const rows = await db`
      insert into movements (plate, model, color, driver, company, observation)
      values (${m.plate}, ${m.model}, ${m.color}, ${m.driver}, ${m.company}, ${m.observation})
      returning *`
    return toMovement(rows[0])
  } catch (err) {
    // Índice único parcial: já existe entrada aberta para a placa.
    if (err?.code === '23505') {
      throw new HttpError(409, `Já existe uma entrada sem saída registrada para a placa ${m.plate}.`)
    }
    throw err
  }
}

export async function registerExit(db, id) {
  if (!UUID_REGEX.test(id || '')) throw new HttpError(404, 'Movimentação não encontrada.')
  const updated = await db`
    update movements set exit_at = now() where id = ${id} and exit_at is null returning *`
  if (updated.length) return toMovement(updated[0])
  // Já tinha saída registrada: devolve como está (mesmo comportamento anterior).
  const existing = await db`select * from movements where id = ${id}`
  if (!existing.length) throw new HttpError(404, 'Movimentação não encontrada.')
  return toMovement(existing[0])
}

export async function dailyStats(db, timezone = process.env.APP_TIMEZONE || 'America/Sao_Paulo') {
  const rows = await db`
    with bounds as (
      select
        (date_trunc('day', now() at time zone ${timezone}) at time zone ${timezone}) as s,
        ((date_trunc('day', now() at time zone ${timezone}) + interval '1 day') at time zone ${timezone}) as e
    )
    select
      count(*) filter (where m.exit_at is null)::int as inside,
      count(*) filter (where m.entry_at >= b.s and m.entry_at < b.e)::int as entered_today,
      count(*) filter (where m.exit_at >= b.s and m.exit_at < b.e)::int as left_today
    from movements m cross join bounds b`
  const r = rows[0]
  return { inside: r.inside, enteredToday: r.entered_today, leftToday: r.left_today }
}
