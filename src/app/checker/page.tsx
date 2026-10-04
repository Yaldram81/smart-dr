import type { Metadata } from 'next'
import SymptomCheckerTab from '@/components/symptom-checker/symptom-checker-tab'

export const metadata: Metadata = {
  title: 'AI Symptom Checker & 3D Anatomy | Smart.Dr',
  description: 'Interactive symptom checker powered by dual-engine AI and real-time 3D human anatomy model visualization.',
}

export default function CheckerPage() {
  return <SymptomCheckerTab />
}
