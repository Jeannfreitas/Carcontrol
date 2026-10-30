import { formatPlate } from '../utils/plate'

const SIZES = {
  sm: 'text-[26px] px-2.5 py-0.5',
  lg: 'text-[38px] px-4 py-1',
}

// Placa no estilo Mercosul: é o elemento que o porteiro reconhece primeiro.
export default function PlateBadge({ plate, size = 'sm' }) {
  return (
    <span
      className="inline-flex flex-col overflow-hidden rounded-md border-2 border-ink bg-white align-middle"
      aria-label={`Placa ${formatPlate(plate)}`}
    >
      <span className="bg-plate-blue text-center text-[8px] font-bold leading-[11px] tracking-[0.25em] text-white">
        BRASIL
      </span>
      <span className={`font-plate font-bold leading-none tracking-wider text-ink ${SIZES[size]}`}>
        {formatPlate(plate)}
      </span>
    </span>
  )
}
