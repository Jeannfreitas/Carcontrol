import { useState } from 'react'
import BottomSheet from './BottomSheet'
import ColorPicker, { OTHER_COLOR } from './ColorPicker'
import { AlertIcon } from './icons'
import { formatPlate, isValidPlate, normalizePlate } from '../utils/plate'
import { formatTime } from '../utils/time'

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-bold">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm font-bold text-alert">{error}</span>}
    </label>
  )
}

export default function EntrySheet({ onClose, onSubmit, findPresentByPlate, onExitInstead }) {
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [colorChoice, setColorChoice] = useState('')
  const [colorOther, setColorOther] = useState('')
  const [driver, setDriver] = useState('')
  const [company, setCompany] = useState('')
  const [observation, setObservation] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const color = colorChoice === OTHER_COLOR ? colorOther.trim() : colorChoice
  const duplicate = plate.length === 7 ? findPresentByPlate(plate) : null

  const errors = {
    plate: !isValidPlate(plate) && 'Informe a placa completa (7 caracteres).',
    model: !model.trim() && 'Informe o modelo.',
    color: !color && 'Escolha a cor.',
    driver: !driver.trim() && 'Informe o nome do motorista.',
  }
  const show = (key) => (submitted && errors[key]) || undefined

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.values(errors).some(Boolean) || duplicate) return
    onSubmit({ plate, model, color, driver, company, observation })
  }

  return (
    <BottomSheet title="Registrar entrada" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Placa" error={show('plate')}>
          <input
            autoFocus
            className="field font-plate text-3xl font-bold tracking-widest uppercase"
            value={plate}
            onChange={(e) => setPlate(normalizePlate(e.target.value))}
            placeholder="ABC1D23"
            maxLength={8}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={Boolean(show('plate') || duplicate)}
          />
        </Field>

        {duplicate && (
          <div role="alert" className="rounded-2xl border-2 border-alert bg-alert/8 p-3.5">
            <p className="flex items-center gap-2 font-bold text-alert">
              <AlertIcon width={22} height={22} />
              {formatPlate(duplicate.plate)} já está no condomínio
            </p>
            <p className="mt-1 text-sm">
              {duplicate.model} {duplicate.color.toLowerCase()}, motorista {duplicate.driver}, entrou às{' '}
              {formatTime(duplicate.entryAt)}. Se o veículo saiu sem registro, registre a saída antes de
              uma nova entrada.
            </p>
            <button
              type="button"
              onClick={() => onExitInstead(duplicate)}
              className="mt-3 h-12 w-full rounded-xl border-2 border-alert font-bold text-alert active:bg-alert/10"
            >
              Registrar saída desse veículo
            </button>
          </div>
        )}

        <Field label="Modelo" error={show('model')}>
          <input
            className="field"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ex.: Onix"
            autoComplete="off"
            maxLength={40}
            aria-invalid={Boolean(show('model'))}
          />
        </Field>

        <div>
          <ColorPicker
            choice={colorChoice}
            otherText={colorOther}
            onChoice={setColorChoice}
            onOtherText={setColorOther}
            invalid={Boolean(show('color'))}
          />
          {show('color') && <p className="mt-1 text-sm font-bold text-alert">{show('color')}</p>}
        </div>

        <Field label="Nome do motorista" error={show('driver')}>
          <input
            className="field"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            placeholder="Nome completo"
            autoComplete="off"
            autoCapitalize="words"
            maxLength={60}
            aria-invalid={Boolean(show('driver'))}
          />
        </Field>

        <Field label="Empresa (opcional)">
          <input
            className="field"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Nome da empresa, se houver"
            autoComplete="organization"
            maxLength={80}
          />
        </Field>

        <Field label="Observação (opcional)">
          <textarea
            className="field min-h-24 resize-y py-3"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Ex.: Prestador de serviço, entrega, visitante..."
            maxLength={300}
            rows={3}
          />
          <span className="mt-1 block text-right text-xs text-ink-soft">{observation.length}/300</span>
        </Field>

        <p className="text-sm text-ink-soft">Data e horário são registrados automaticamente ao confirmar.</p>

        <button
          type="submit"
          disabled={Boolean(duplicate)}
          className="h-14 w-full rounded-2xl bg-petrol text-lg font-bold text-white active:bg-petrol-deep disabled:bg-line disabled:text-ink-soft"
        >
          Confirmar entrada
        </button>
      </form>
    </BottomSheet>
  )
}
