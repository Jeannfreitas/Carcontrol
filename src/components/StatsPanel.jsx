export default function StatsPanel({ stats }) {
  return (
    <section aria-label="Resumo do dia" className="grid grid-cols-2 gap-3">
      <div className="col-span-2 flex items-center justify-between rounded-2xl bg-petrol px-5 py-4 text-white">
        <div>
          <p className="text-lg font-bold leading-tight">No condomínio agora</p>
          <p className="text-sm text-white/75">
            {stats.inside === 1 ? '1 veículo presente' : `${stats.inside} veículos presentes`}
          </p>
        </div>
        <p className="text-6xl font-bold leading-none tabular-nums" aria-hidden="true">
          {stats.inside}
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-white px-4 py-3">
        <p className="text-3xl font-bold tabular-nums">{stats.enteredToday}</p>
        <p className="text-sm text-ink-soft">Entraram hoje</p>
      </div>
      <div className="rounded-2xl border border-line bg-white px-4 py-3">
        <p className="text-3xl font-bold tabular-nums">{stats.leftToday}</p>
        <p className="text-sm text-ink-soft">Saíram hoje</p>
      </div>
    </section>
  )
}
