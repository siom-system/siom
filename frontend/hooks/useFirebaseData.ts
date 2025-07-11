"use client"

import { useState, useEffect } from "react"
import {
  FirebaseService,
  type FirebaseAssetData,
  type FirebaseSystemStatus,
  type FirebaseHistoricalSignal,
} from "@/lib/firebase-service"

// Hook para buscar todos os ativos
export function useAssets() {
  const [assets, setAssets] = useState<FirebaseAssetData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = () => {
      unsubscribe = FirebaseService.subscribeToAssets((newAssets) => {
        setAssets(newAssets)
        setLoading(false)
        setError(null)
      })
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return { assets, loading, error }
}

// Hook para buscar status do sistema
export function useSystemStatus() {
  const [status, setStatus] = useState<FirebaseSystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = () => {
      unsubscribe = FirebaseService.subscribeToSystemStatus((newStatus) => {
        setStatus(newStatus)
        setLoading(false)
        setError(null)
      })
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return { status, loading, error }
}

// Hook para buscar ativos por filtro
export function useFilteredAssets(filter?: { riskCategory?: string; priority?: string }) {
  const [assets, setAssets] = useState<FirebaseAssetData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true)
      try {
        let result: FirebaseAssetData[] = []

        if (filter?.riskCategory) {
          result = await FirebaseService.getAssetsByRisk(filter.riskCategory)
        } else if (filter?.priority) {
          result = await FirebaseService.getAssetsByPriority(filter.priority)
        } else {
          result = await FirebaseService.getAssets()
        }

        setAssets(result)
        setError(null)
      } catch (err) {
        setError("Erro ao carregar ativos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [filter?.riskCategory, filter?.priority])

  return { assets, loading, error }
}

// Hook para buscar histórico de sinais
export function useHistoricalSignals(limit = 50) {
  const [signals, setSignals] = useState<FirebaseHistoricalSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSignals = async () => {
      setLoading(true)
      try {
        const result = await FirebaseService.getHistoricalSignals(limit)
        setSignals(result)
        setError(null)
      } catch (err) {
        setError("Erro ao carregar histórico")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
  }, [limit])

  return { signals, loading, error }
}

// Hook para buscar ativo específico
export function useAsset(id: string) {
  const [asset, setAsset] = useState<FirebaseAssetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchAsset = async () => {
      setLoading(true)
      try {
        const result = await FirebaseService.getAsset(id)
        setAsset(result)
        setError(null)
      } catch (err) {
        setError("Erro ao carregar ativo")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  return { asset, loading, error }
}
