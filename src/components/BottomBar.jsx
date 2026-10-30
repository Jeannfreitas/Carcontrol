import { HistoryIcon, HomeIcon, PlusIcon } from './icons'

const TABS = [
  { id: 'home', label: 'Início', Icon: HomeIcon },
  { id: 'history', label: 'Histórico', Icon: HistoryIcon },
]

export default function BottomBar({ view, onChangeView, onRegisterEntry }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto w-full max-w-md px-4 pt-3">
        <button
          type="button"
          onClick={onRegisterEntry}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-amber text-lg font-bold text-ink active:bg-amber-deep"
        >
          <PlusIcon width={26} height={26} strokeWidth={2.8} />
          Registrar entrada
        </button>
        <div className="mt-1 grid grid-cols-2">
          {TABS.map(({ id, label, Icon }) => {
            const active = view === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChangeView(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex h-14 flex-col items-center justify-center gap-0.5 text-sm ${
                  active ? 'font-bold text-petrol' : 'text-ink-soft'
                }`}
              >
                <Icon width={22} height={22} />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
