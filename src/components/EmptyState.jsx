export default function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-line px-5 py-8 text-center">
      <p className="text-lg font-bold">{title}</p>
      {text && <p className="mt-1 text-ink-soft">{text}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 h-12 rounded-xl border-2 border-petrol px-5 font-bold text-petrol active:bg-petrol/10"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
