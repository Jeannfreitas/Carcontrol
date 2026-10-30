import BottomSheet from './BottomSheet'
import PlateBadge from './PlateBadge'
import { formatDuration, formatTime } from '../utils/time'

export default function ExitSheet({ movement, now, onClose, onConfirm }) {
  const stay = formatDuration(now - new Date(movement.entryAt).getTime())
  return (
    <BottomSheet title="Registrar saída" onClose={onClose}>
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-paper px-4 py-5 text-center">
        <PlateBadge plate={movement.plate} size="lg" />
        <p className="mt-1 text-lg font-bold">
          {movement.model} · {movement.color}
        </p>
        <p>{movement.driver}</p>
        <p className="text-sm text-ink-soft">
          Entrou às {formatTime(movement.entryAt)} · dentro há {stay}
        </p>
      </div>
      <p className="mt-4 text-center text-ink-soft">A saída será registrada com a data e a hora de agora.</p>
      <div className="mt-4 space-y-2.5">
        <button
          type="button"
          autoFocus
          onClick={() => onConfirm(movement)}
          className="h-14 w-full rounded-2xl bg-go text-lg font-bold text-white active:brightness-90"
        >
          Confirmar saída
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-14 w-full rounded-2xl border-2 border-line text-lg font-bold text-ink-soft active:bg-paper"
        >
          Cancelar
        </button>
      </div>
    </BottomSheet>
  )
}
