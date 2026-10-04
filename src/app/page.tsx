import type { Metadata } from 'next'
import HomeTab from '@/components/home/home-tab'

export const metadata: Metadata = {
  title: 'Home | Smart.Dr - AI-Powered Disease Prediction System',
  description: 'Advanced symptom-based disease prediction powered by dual-engine AI. Get instant health insights by selecting your symptoms and receiving AI-analyzed disease predictions.',
}

export default function HomePage() {
  return <HomeTab />
}
