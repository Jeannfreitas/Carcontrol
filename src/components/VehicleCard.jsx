import PlateBadge from './PlateBadge'
import { ExitIcon } from './icons'
import { colorHex } from '../utils/colors'
import { formatDate, formatDuration, formatTime, isSameDay } from '../utils/time'

// Hoje mostra só a hora; outros dias mostram dia/mês + hora.
function when(iso, nowIso) {
  if (!iso) return '—'
  if (isSameDay(iso, nowIso)) return formatTime(iso)
  return `${formatDate(iso).slice(0, 5)} ${formatTime(iso)}`
}

export default function VehicleCard({ movement, now, onExit }) {
  const nowIso = new Date(now).toISOString()
  const inside = !movement.exitAt
  const end = inside ? now : new Date(movement.exitAt).getTime()
  const stay = formatDuration(end - new Date(movement.entryAt).getTime())
  const hex = colorHex(movement.color)

  return (
    <article className="rounded-2xl border border-line bg-white p-3.5">
      <div className="flex items-center gap-3">
        <PlateBadge plate={movement.plate} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg leading-tight font-bold">{movement.model}</p>
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full border border-ink/40"
              style={{ background: hex ?? 'transparent' }}
              aria-hidden="true"
            />
            {movement.color}
          </p>
        </div>
        {!onExit && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
              inside ? 'bg-petrol/12 text-petrol' : 'bg-paper text-ink-soft'
            }`}
          >
            {inside ? 'No condomínio' : 'Saiu'}
          </span>
        )}
      </div>

      <p className="mt-2.5 truncate">
        <span className="text-ink-soft">Motorista </span>
        <span className="font-bold">{movement.driver}</span>
      </p>

      {movement.company && (
        <p className="mt-1 truncate text-sm">
          <span className="text-ink-soft">Empresa </span>
          <span className="font-bold">{movement.company}</span>
        </p>
      )}
      {movement.observation && (
        <div className="mt-2 rounded-xl bg-paper px-3 py-2 text-sm">
          <p className="font-bold text-ink-soft">Observação</p>
          <p className="whitespace-pre-wrap break-words">{movement.observation}</p>
        </div>
      )}

      <dl className="mt-2.5 grid grid-cols-3 gap-2 border-t border-line pt-2.5 text-sm">
        <div>
          <dt className="text-ink-soft">Entrada</dt>
          <dd className="font-bold tabular-nums">{when(movement.entryAt, nowIso)}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">Saída</dt>
          <dd className="font-bold tabular-nums">{when(movement.exitAt, nowIso)}</dd>
        </div>
        <div>
          <dt className="text-ink-soft">{inside ? 'Dentro há' : 'Permaneceu'}</dt>
          <dd className="font-bold tabular-nums">{stay}</dd>
        </div>
      </dl>

      {onExit && (
        <button
          type="button"
          onClick={() => onExit(movement)}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-go bg-go/10 font-bold text-go active:bg-go/20"
        >
          <ExitIcon width={22} height={22} />
          Registrar saída
        </button>
      )}
    </article>
  )
}
