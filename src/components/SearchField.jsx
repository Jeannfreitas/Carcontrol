import { CloseIcon, SearchIcon } from './icons'

export default function SearchField({ value, onChange, placeholder = 'Buscar placa ou motorista' }) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        autoCorrect="off"
        enterKeyHint="search"
        className="field pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          className="absolute top-1/2 right-1 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ink-soft"
        >
          <CloseIcon width={20} height={20} />
        </button>
      )}
    </div>
  )
}
