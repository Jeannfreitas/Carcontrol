import { VEHICLE_COLORS } from '../utils/colors'

export const OTHER_COLOR = 'Outra'

export default function ColorPicker({ choice, otherText, onChoice, onOtherText, invalid }) {
  return (
    <fieldset>
      <legend className="mb-1.5 font-bold">Cor</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-invalid={invalid}>
        {[...VEHICLE_COLORS, { name: OTHER_COLOR, hex: null }].map((c) => {
          const selected = choice === c.name
          return (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChoice(c.name)}
              className={`flex h-12 items-center gap-2 rounded-xl border-2 px-3.5 font-bold ${
                selected
                  ? 'border-petrol bg-petrol text-white'
                  : invalid
                    ? 'border-alert bg-white text-ink'
                    : 'border-line bg-white text-ink'
              }`}
            >
              {c.hex && (
                <span
                  className="h-4 w-4 rounded-full border border-ink/40"
                  style={{ background: c.hex }}
                  aria-hidden="true"
                />
              )}
              {c.name}
            </button>
          )
        })}
      </div>
      {choice === OTHER_COLOR && (
        <input
          className="field mt-2"
          value={otherText}
          onChange={(e) => onOtherText(e.target.value)}
          placeholder="Qual a cor?"
          aria-label="Cor do veículo"
          autoComplete="off"
          maxLength={20}
        />
      )}
    </fieldset>
  )
}
