'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { TrendingUp } from 'lucide-react'
import { BMICalculator } from '@/components/dashboard/bmi-calculator'
import { HealthTips } from '@/components/dashboard/health-tips'
import { HealthAssessmentScore } from '@/components/dashboard/health-assessment-score'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { PredictionHistoryPanel } from '@/components/dashboard/prediction-history-panel'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { SymptomDurationTracker } from '@/components/dashboard/symptom-duration-tracker'
import { WaterIntakeTracker } from '@/components/dashboard/water-intake-tracker'
import { UserProfileCard } from '@/components/dashboard/user-profile-card'
import { HealthScoreTimeline } from '@/components/dashboard/health-score-timeline'
import { MedicationReminder } from '@/components/dashboard/medication-reminder'

export default function DashboardTab() {
  const { user } = useAppStore()
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="size-8 text-primary" />
          Health Dashboard
        </h2>
        <p className="text-muted-foreground mt-2">Track your health metrics and view prediction history</p>
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="mb-6">
          <UserProfileCard />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <HealthScoreTimeline />
        <MedicationReminder />
        <BMICalculator />
        <HealthAssessmentScore />
        <QuickStats />
        <SymptomDurationTracker />
        <DashboardCharts />
        <WaterIntakeTracker />
        <HealthTips />
        <div className="lg:col-span-2">
          <PredictionHistoryPanel />
        </div>
      </div>
    </div>
  )
}
