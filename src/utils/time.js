const pad = (n) => String(n).padStart(2, '0')

export function formatTime(iso) {
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatDate(iso) {
  const d = new Date(iso)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function toDateInputValue(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function isSameDay(isoA, isoB) {
  return toDateInputValue(isoA) === toDateInputValue(isoB)
}

export function dayLabel(iso, nowIso = new Date().toISOString()) {
  if (isSameDay(iso, nowIso)) return 'Hoje'
  const yesterday = new Date(nowIso)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(iso, yesterday.toISOString())) return 'Ontem'
  return formatDate(iso)
}

export function formatDuration(ms) {
  const totalMin = Math.max(0, Math.floor(ms / 60000))
  if (totalMin < 1) return 'menos de 1 min'
  const days = Math.floor(totalMin / 1440)
  const hours = Math.floor((totalMin % 1440) / 60)
  const mins = totalMin % 60
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return mins > 0 ? `${hours}h ${pad(mins)}min` : `${hours}h`
  return `${mins}min`
}
