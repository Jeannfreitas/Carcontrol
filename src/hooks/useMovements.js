import { useCallback, useEffect, useMemo, useState } from 'react'
import { createEntry, createExit, loadDailyStats, loadMovements } from '../services/movementService'
import { normalizePlate } from '../utils/plate'

const EMPTY_STATS = { inside: 0, enteredToday: 0, leftToday: 0 }

export function useMovements() {
  const [movements, setMovements] = useState([])
  const [stats, setStats] = useState(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    try {
      const [rows, daily] = await Promise.all([loadMovements(), loadDailyStats()])
      setMovements(rows)
      setStats(daily)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([loadMovements(), loadDailyStats()])
      .then(([rows, daily]) => {
        if (!active) return
        setMovements(rows)
        setStats(daily)
        setError('')
      })
      .catch((err) => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const present = useMemo(
    () => movements.filter((m) => !m.exitAt).sort((a, b) => new Date(b.entryAt) - new Date(a.entryAt)),
    [movements],
  )

  const findPresentByPlate = useCallback(
    (plate) => present.find((m) => m.plate === normalizePlate(plate)),
    [present],
  )

  const registerEntry = useCallback(async (data) => {
    const duplicate = findPresentByPlate(data.plate)
    if (duplicate) return { ok: false, duplicate }
    try {
      const movement = await createEntry(data)
      setMovements((current) => [movement, ...current])
      loadDailyStats().then(setStats).catch(() => {})
      return { ok: true, movement }
    } catch (err) {
      if (err.message.includes('Já existe uma entrada sem saída')) {
        const current = await loadMovements().catch(() => movements)
        setMovements(current)
        return { ok: false, duplicate: current.find((m) => m.plate === normalizePlate(data.plate) && !m.exitAt), error: err.message }
      }
      return { ok: false, error: err.message }
    }
  }, [findPresentByPlate, movements])

  const registerExit = useCallback(async (id) => {
    const updated = await createExit(id)
    setMovements((current) => current.map((m) => m.id === id ? updated : m))
    loadDailyStats().then(setStats).catch(() => {})
    return updated
  }, [])

  return { movements, present, stats, loading, error, refresh, findPresentByPlate, registerEntry, registerExit }
}
