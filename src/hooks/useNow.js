import { useEffect, useState } from 'react'

// Atualiza a cada 30 s para o tempo de permanência acompanhar o relógio.
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
