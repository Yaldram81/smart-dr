import type { Metadata } from 'next'
import PredictionResultsTab from '@/components/prediction-results/prediction-results-tab'

export const metadata: Metadata = {
  title: 'Prediction Results & Clinical Analysis | Smart.Dr',
  description: 'AI-analyzed disease predictions, confidence metrics, Urdu explanations, and clinical prescription reports.',
}

export default function ResultsPage() {
  return <PredictionResultsTab />
}
