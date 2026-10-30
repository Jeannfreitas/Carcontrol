import { CheckIcon } from './icons'

export default function Toast({ toast }) {
  if (!toast) return null
  const tone = toast.kind === 'exit' ? 'bg-go' : 'bg-petrol-deep'
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[calc(0.75rem+env(safe-area-inset-top))]"
    >
      <div
        key={toast.id}
        className={`animate-toast flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3.5 text-white shadow-lg ${tone}`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
          <CheckIcon />
        </span>
        <div className="min-w-0">
          <p className="font-bold leading-tight">{toast.title}</p>
          <p className="truncate text-sm leading-tight text-white/85">{toast.detail}</p>
        </div>
      </div>
    </div>
  )
}
