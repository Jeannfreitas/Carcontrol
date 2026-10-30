import { useMemo, useState } from 'react'
import SearchField from '../components/SearchField'
import VehicleCard from '../components/VehicleCard'
import EmptyState from '../components/EmptyState'
import { matchesQuery } from '../utils/search'
import { dayLabel, isSameDay, toDateInputValue } from '../utils/time'

const STATUS = [
  { id: 'all', label: 'Todos' },
  { id: 'inside', label: 'No condomínio' },
  { id: 'left', label: 'Já saíram' },
]

export default function History({ movements, now, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () =>
      movements
        .filter((m) => matchesQuery(m, query))
        .filter((m) => status === 'all' || (status === 'inside' ? !m.exitAt : Boolean(m.exitAt)))
        .filter((m) => {
          if (!date) return true
          const wanted = new Date(`${date}T12:00:00`).toISOString()
          return isSameDay(m.entryAt, wanted) || (m.exitAt && isSameDay(m.exitAt, wanted))
        })
        .sort((a, b) => new Date(b.entryAt) - new Date(a.entryAt)),
    [movements, query, date, status],
  )

  const groups = useMemo(() => {
    const nowIso = new Date(now).toISOString()
    const map = new Map()
    filtered.forEach((m) => {
      const key = toDateInputValue(m.entryAt)
      if (!map.has(key)) map.set(key, { label: dayLabel(m.entryAt, nowIso), items: [] })
      map.get(key).items.push(m)
    })
    return [...map.values()]
  }, [filtered, now])

  const hasFilters = query || date || status !== 'all'
  const clear = () => {
    setQuery('')
    setDate('')
    setStatus('all')
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-ink-soft">Todas as movimentações, da mais recente para a mais antiga.</p>
      </header>

      <div className="space-y-3">
        <SearchField value={query} onChange={setQuery} />

        <label className="block">
          <span className="mb-1 block text-sm font-bold">Data de entrada ou saída</span>
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field flex-1"
              aria-label="Filtrar por data"
            />
            {date && (
              <button
                type="button"
                onClick={() => setDate('')}
                className="h-14 shrink-0 rounded-[0.875rem] border-2 border-line bg-white px-4 font-bold text-ink-soft"
              >
                Limpar
              </button>
            )}
          </div>
        </label>

        <div role="radiogroup" aria-label="Situação" className="grid grid-cols-3 gap-1.5 rounded-2xl bg-line/60 p-1.5">
          {STATUS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={status === s.id}
              onClick={() => setStatus(s.id)}
              className={`h-12 rounded-xl text-sm font-bold ${
                status === s.id ? 'bg-petrol text-white' : 'text-ink-soft'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-bold" aria-live="polite">
          {filtered.length === 1 ? '1 movimentação' : `${filtered.length} movimentações`}
        </p>
        {hasFilters && (
          <button type="button" onClick={clear} className="h-12 px-2 font-bold text-petrol">
            Limpar filtros
          </button>
        )}
      </div>

      {groups.length > 0 ? (
        groups.map((g) => (
          <section key={g.label} className="space-y-3">
            <h2 className="text-sm font-bold text-ink-soft">{g.label}</h2>
            {g.items.map((m) => (
              <VehicleCard key={m.id} movement={m} now={now} />
            ))}
          </section>
        ))
      ) : (
        <EmptyState
          title="Nada encontrado"
          text="Nenhuma movimentação combina com esses filtros."
          action={hasFilters ? { label: 'Limpar filtros', onClick: clear } : undefined}
        />
      )}

    </div>
  )
}
