import { db } from "./firebase"
import { collection, getDocs, doc, getDoc, onSnapshot, query, where, orderBy, limit } from "firebase/firestore"

// Interfaces para tipagem dos dados
export interface FirebaseAssetData {
  id: string
  name: string
  ticker: string
  dominantTimeframe: string
  alignmentScore: number
  riskCategory: "Ideal" | "Atencao" | "Risco"
  priority: "Squeeze" | "Breakout" | "Alta_Volatilidade" | "Normal"
  regime: string
  context: string
  volatility: string
  activeSignals: number
  finalScore: number
  confidence: number
  trend: "Bullish" | "Bearish" | "Neutro"
  sparklineData: number[]
  alerts: {
    squeezeCritico: boolean
    breakoutAtivo: boolean
    altaVolatilidade: boolean
    atencaoNecessaria: boolean
    riscoElevado: boolean
  }
  lastUpdate: string
  createdAt: any
  updatedAt: any
}

export interface FirebaseSystemStatus {
  isOnline: boolean
  lastSync: string
  totalAnalyses: number
  activeTraders: number
  precision: number
  marketStatus: string
}

export interface FirebaseHistoricalSignal {
  id: string
  asset: string
  timeframe: string
  timestamp: string
  score: number
  confidence: number
  trend: "Bullish" | "Bearish" | "Neutro"
  marketState: string
  details: {
    volume: string
    rsi: number
    macd: string
    support: string
    resistance: string
  }
}

// Serviços para buscar dados do Firebase
export class FirebaseService {
  // Buscar todos os ativos
  static async getAssets(): Promise<FirebaseAssetData[]> {
    try {
      const assetsRef = collection(db, "assets")
      const q = query(assetsRef, orderBy("updatedAt", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseAssetData[]
    } catch (error) {
      console.error("Erro ao buscar ativos:", error)
      return []
    }
  }

  // Buscar ativo específico
  static async getAsset(id: string): Promise<FirebaseAssetData | null> {
    try {
      const assetRef = doc(db, "assets", id)
      const snapshot = await getDoc(assetRef)

      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data(),
        } as FirebaseAssetData
      }
      return null
    } catch (error) {
      console.error("Erro ao buscar ativo:", error)
      return null
    }
  }

  // Buscar ativos por categoria de risco
  static async getAssetsByRisk(riskCategory: string): Promise<FirebaseAssetData[]> {
    try {
      const assetsRef = collection(db, "assets")
      const q = query(assetsRef, where("riskCategory", "==", riskCategory), orderBy("alignmentScore", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseAssetData[]
    } catch (error) {
      console.error("Erro ao buscar ativos por risco:", error)
      return []
    }
  }

  // Buscar ativos por prioridade
  static async getAssetsByPriority(priority: string): Promise<FirebaseAssetData[]> {
    try {
      const assetsRef = collection(db, "assets")
      const q = query(assetsRef, where("priority", "==", priority), orderBy("confidence", "desc"))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseAssetData[]
    } catch (error) {
      console.error("Erro ao buscar ativos por prioridade:", error)
      return []
    }
  }

  // Buscar status do sistema
  static async getSystemStatus(): Promise<FirebaseSystemStatus | null> {
    try {
      const statusRef = doc(db, "system", "status")
      const snapshot = await getDoc(statusRef)

      if (snapshot.exists()) {
        return snapshot.data() as FirebaseSystemStatus
      }
      return null
    } catch (error) {
      console.error("Erro ao buscar status do sistema:", error)
      return null
    }
  }

  // Buscar histórico de sinais
  static async getHistoricalSignals(limitCount = 50): Promise<FirebaseHistoricalSignal[]> {
    try {
      const signalsRef = collection(db, "historical_signals")
      const q = query(signalsRef, orderBy("timestamp", "desc"), limit(limitCount))
      const snapshot = await getDocs(q)

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseHistoricalSignal[]
    } catch (error) {
      console.error("Erro ao buscar histórico de sinais:", error)
      return []
    }
  }

  // Listener em tempo real para ativos
  static subscribeToAssets(callback: (assets: FirebaseAssetData[]) => void) {
    const assetsRef = collection(db, "assets")
    const q = query(assetsRef, orderBy("updatedAt", "desc"))

    return onSnapshot(
      q,
      (snapshot) => {
        const assets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirebaseAssetData[]

        callback(assets)
      },
      (error) => {
        console.error("Erro no listener de ativos:", error)
      },
    )
  }

  // Listener em tempo real para status do sistema
  static subscribeToSystemStatus(callback: (status: FirebaseSystemStatus | null) => void) {
    const statusRef = doc(db, "system", "status")

    return onSnapshot(
      statusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as FirebaseSystemStatus)
        } else {
          callback(null)
        }
      },
      (error) => {
        console.error("Erro no listener de status:", error)
      },
    )
  }
}
