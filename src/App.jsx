import { useCallback, useEffect, useState } from 'react'
import { useMovements } from './hooks/useMovements'
import { useNow } from './hooks/useNow'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import BottomBar from './components/BottomBar'
import EntrySheet from './components/EntrySheet'
import ExitSheet from './components/ExitSheet'
import Toast from './components/Toast'
import { formatPlate } from './utils/plate'
import { formatTime } from './utils/time'

export default function App() {
  const { movements, present, stats, loading, error, refresh, findPresentByPlate, registerEntry, registerExit } =
    useMovements()
  const now = useNow()

  const [view, setView] = useState('home')
  const [historyQuery, setHistoryQuery] = useState('')
  const [entryOpen, setEntryOpen] = useState(false)
  const [exitTarget, setExitTarget] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const notify = useCallback((kind, title, movement, iso) => {
    navigator.vibrate?.(60)
    setToast({
      id: Date.now(),
      kind,
      title,
      detail: `${formatPlate(movement.plate)} · ${movement.model} · ${formatTime(iso)}`,
    })
  }, [])

  const handleEntry = async (data) => {
    const result = await registerEntry(data)
    if (!result.ok) {
      if (result.error && !result.duplicate) window.alert(result.error)
      return
    }
    setEntryOpen(false)
    setView('home')
    notify('entry', 'Entrada registrada', result.movement, result.movement.entryAt)
  }

  const handleExit = async (movement) => {
    try {
      const updated = await registerExit(movement.id)
      setExitTarget(null)
      notify('exit', 'Saída registrada', updated, updated.exitAt)
    } catch (err) {
      window.alert(err.message)
    }
  }

  const changeView = (next) => {
    setView(next)
    if (next === 'history') setHistoryQuery('')
    window.scrollTo({ top: 0 })
  }

  const searchHistory = (query) => {
    setHistoryQuery(query)
    setView('history')
    window.scrollTo({ top: 0 })
  }

  if (loading) {
    return <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-6 text-center"><p className="font-bold text-ink-soft">Conectando ao servidor da portaria...</p></div>
  }

  if (error) {
    return <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center"><h1 className="text-2xl font-bold">Não foi possível carregar os dados</h1><p className="text-ink-soft">{error}</p><button type="button" onClick={() => refresh().catch((err) => window.alert(err.message))} className="h-12 rounded-xl bg-petrol px-5 font-bold text-white">Tentar novamente</button></div>
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md px-4 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-48">
      <Toast toast={toast} />

      <main>
        {view === 'home' ? (
          <Dashboard
            present={present}
            stats={stats}
            now={now}
            onExit={setExitTarget}
            onSearchHistory={searchHistory}
          />
        ) : (
          <History
            key={historyQuery}
            movements={movements}
            now={now}
            initialQuery={historyQuery}
          />
        )}
      </main>

      <BottomBar view={view} onChangeView={changeView} onRegisterEntry={() => setEntryOpen(true)} />

      {entryOpen && (
        <EntrySheet
          onClose={() => setEntryOpen(false)}
          onSubmit={handleEntry}
          findPresentByPlate={findPresentByPlate}
          onExitInstead={(movement) => {
            setEntryOpen(false)
            setExitTarget(movement)
          }}
        />
      )}

      {exitTarget && (
        <ExitSheet
          movement={exitTarget}
          now={now}
          onClose={() => setExitTarget(null)}
          onConfirm={handleExit}
        />
      )}
    </div>
  )
}
