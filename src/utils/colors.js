export const VEHICLE_COLORS = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Preto', hex: '#1B1F22' },
  { name: 'Prata', hex: '#C3C8CC' },
  { name: 'Cinza', hex: '#7A8288' },
  { name: 'Vermelho', hex: '#C62828' },
  { name: 'Azul', hex: '#1F4FA3' },
  { name: 'Verde', hex: '#2E7D4F' },
  { name: 'Amarelo', hex: '#E9B100' },
  { name: 'Marrom', hex: '#7B5233' },
]

export function colorHex(name) {
  return VEHICLE_COLORS.find((c) => c.name.toLowerCase() === name?.toLowerCase())?.hex ?? null
}
