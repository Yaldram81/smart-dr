import type { Language } from '@/lib/urdu-translations'

// Shared disease data type used across DiseaseBrowser and PredictionResults
export interface DiseaseDataItem {
  name: string
  slug?: string
  severity: Severity | string
  category: string
  specialist: string
  description: string
  treatmentOverview?: string
  emergencyWarnings?: string[]
  symptoms: string[]
  precautions: string[]
  medications: string[]
  diet: string[]
  workout: string[]
}

// Symptom importance taxonomy
export type SymptomImportance = 'HALLMARK' | 'COMMON' | 'OCCASIONAL'

// Notification type
export interface Notification {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  read: boolean
  type: 'welcome' | 'profile' | 'tip' | 'history'
}

// Tracked symptom for duration tracker
export interface TrackedSymptom {
  id: string
  name: string
  duration: number
  addedAt: number
}

// Medication entry for reminders
export interface MedicationEntry {
  id: string
  name: string
  dosage: string
  time: string
  taken: boolean
}

// Clinically structured severity levels
export type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL' | 'mild' | 'moderate' | 'severe' | 'critical'

