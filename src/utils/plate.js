// Aceita placa antiga (ABC1234) e Mercosul (ABC1D23).
const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

export function normalizePlate(value = '') {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
}

export function isValidPlate(value) {
  return PLATE_REGEX.test(normalizePlate(value))
}

// Placa antiga ganha hífen (ABC-1234); Mercosul fica sem.
export function formatPlate(value = '') {
  const plate = normalizePlate(value)
  if (plate.length === 7 && /[0-9]/.test(plate[4])) {
    return `${plate.slice(0, 3)}-${plate.slice(3)}`
  }
  return plate
}
