import { normalizePlate } from './plate'

const strip = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// Busca por placa (com ou sem hífen) ou nome do motorista (sem acento).
export function matchesQuery(movement, query) {
  const q = query.trim()
  if (!q) return true
  const plateQuery = normalizePlate(q)
  if (plateQuery && movement.plate.includes(plateQuery)) return true
  const term = strip(q)
  return strip(movement.driver).includes(term) || strip(movement.company || '').includes(term) || strip(movement.observation || '').includes(term)
}
