import { useState } from 'react'
import StatsPanel from '../components/StatsPanel'
import SearchField from '../components/SearchField'
import VehicleCard from '../components/VehicleCard'
import EmptyState from '../components/EmptyState'
import { matchesQuery } from '../utils/search'

const todayLabel = () =>
  new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

export default function Dashboard({ present, stats, now, onExit, onSearchHistory }) {
  const [query, setQuery] = useState('')
  const results = present.filter((m) => matchesQuery(m, query))
  const searching = query.trim().length > 0

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Portaria</h1>
        <p className="text-ink-soft first-letter:uppercase">{todayLabel()}</p>
      </header>

      <StatsPanel stats={stats} />

      <section aria-labelledby="present-title" className="space-y-3">
        <h2 id="present-title" className="text-lg font-bold">
          Veículos no condomínio
        </h2>
        <SearchField value={query} onChange={setQuery} />

        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((m) => (
              <VehicleCard key={m.id} movement={m} now={now} onExit={onExit} />
            ))}
          </div>
        ) : searching ? (
          <EmptyState
            title="Nenhum veículo presente com essa busca"
            text="Ele pode já ter saído. Confira no histórico."
            action={{ label: 'Buscar no histórico', onClick: () => onSearchHistory(query) }}
          />
        ) : (
          <EmptyState
            title="Nenhum veículo no condomínio"
            text="Toque em Registrar entrada quando um veículo chegar."
          />
        )}
      </section>
    </div>
  )
}
