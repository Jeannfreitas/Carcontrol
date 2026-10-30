import { useEffect } from 'react'
import { CloseIcon } from './icons'

export default function BottomSheet({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button
        type="button"
        aria-label="Fechar"
        tabIndex={-1}
        onClick={onClose}
        className="animate-fade absolute inset-0 bg-ink/55"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-sheet relative max-h-[94dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white px-5 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full text-ink-soft active:bg-paper"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
