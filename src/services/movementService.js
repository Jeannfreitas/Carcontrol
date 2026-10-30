import { normalizePlate } from '../utils/plate'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.')
  }

  const body = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(body?.message || `Erro na comunicação com o servidor (${response.status}).`)
  }
  return body
}

export function loadMovements() {
  return request('/movements')
}

export function loadDailyStats() {
  return request('/movements/stats/daily')
}

export function createEntry({ plate, model, color, driver, company = '', observation = '' }) {
  return request('/movements', {
    method: 'POST',
    body: JSON.stringify({
      plate: normalizePlate(plate),
      model: model.trim(),
      color: color.trim(),
      driver: driver.trim(),
      company: company.trim(),
      observation: observation.trim(),
    }),
  })
}

export function createExit(id) {
  return request(`/movements/${id}/exit`, { method: 'PATCH' })
}
