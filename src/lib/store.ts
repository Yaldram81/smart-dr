import { create } from 'zustand'
import type { Language } from './urdu-translations'

// Types
export interface User {
  id: string
  email: string
  name: string
  age?: number | null
  gender?: string | null
  bloodGroup?: string | null
}

export interface Symptom {
  id: string
  name: string
  slug?: string
  category: string
  description?: string | null
  imageUrl?: string | null
  alternateNames?: string[]
  bodySystem?: string | null
  isActive?: boolean
}

export interface PredictionResult {
  disease: string
  similarityScore: number // 0-100% Symptom pattern similarity
  confidence: number      // Backward compatibility alias
  description: string
  specialist: string
  severity: string
  treatmentOverview?: string
  precautions: string[]
  medications: string[]   // Educational reference: commonly used medications
  diet: string[]
  workout: string[]
  emergencyWarnings?: string[]
  matchedSymptoms: string[]
  totalSymptoms: number
  contributingSymptoms?: { name: string; importance: string; score: number }[]
  absentHallmarks?: { name: string; importance: string }[]
  contraindications?: string[]
  algorithmVersion?: string
}

export interface HistoryPrediction {
  id: string
  selectedSymptoms: string[]
  results: PredictionResult[]
  llmAnalysis: string | null
  createdAt: string
}

export type ActiveSection = 'home' | 'checker' | 'results' | 'dashboard'
export type PredictionEngine = 'local-ml' | 'online-ai'

interface AppState {
  // Navigation
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void

  // Auth
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void

  // Symptoms
  symptoms: Symptom[]
  setSymptoms: (symptoms: Symptom[]) => void
  selectedSymptomIds: string[]
  toggleSymptom: (id: string) => void
  clearSelectedSymptoms: () => void

  // Prediction
  predictions: PredictionResult[]
  setPredictions: (predictions: PredictionResult[]) => void
  llmAnalysis: string | null
  setLlmAnalysis: (analysis: string | null) => void
  predictionEngine: PredictionEngine
  setPredictionEngine: (engine: PredictionEngine) => void

  // Loading
  isPredicting: boolean
  setIsPredicting: (loading: boolean) => void
  isLoadingSymptoms: boolean
  setIsLoadingSymptoms: (loading: boolean) => void

  // History
  history: HistoryPrediction[]
  setHistory: (history: HistoryPrediction[]) => void

  // Search
  symptomSearch: string
  setSymptomSearch: (search: string) => void

  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Privacy
  privacyMode: boolean
  setPrivacyMode: (mode: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),

  // Auth
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),

  // Symptoms
  symptoms: [],
  setSymptoms: (symptoms) => set({ symptoms }),
  selectedSymptomIds: [],
  toggleSymptom: (id) =>
    set((state) => {
      const isSelected = state.selectedSymptomIds.includes(id)
      return {
        selectedSymptomIds: isSelected
          ? state.selectedSymptomIds.filter((sId) => sId !== id)
          : [...state.selectedSymptomIds, id],
      }
    }),
  clearSelectedSymptoms: () => set({ selectedSymptomIds: [] }),

  // Prediction
  predictions: [],
  setPredictions: (predictions) => set({ predictions }),
  llmAnalysis: null,
  setLlmAnalysis: (analysis) => set({ llmAnalysis: analysis }),
  predictionEngine: 'local-ml',
  setPredictionEngine: (engine) => set({ predictionEngine: engine }),

  // Loading
  isPredicting: false,
  setIsPredicting: (loading) => set({ isPredicting: loading }),
  isLoadingSymptoms: false,
  setIsLoadingSymptoms: (loading) => set({ isLoadingSymptoms: loading }),

  // History
  history: [],
  setHistory: (history) => set({ history }),

  // Search
  symptomSearch: '',
  setSymptomSearch: (search) => set({ symptomSearch: search }),

  // Language
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  // Privacy
  privacyMode: true, // Default ON - zero PHI storage
  setPrivacyMode: (mode) => set({ privacyMode: mode }),
}))
