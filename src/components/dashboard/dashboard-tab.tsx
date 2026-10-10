'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { UserProfileCard } from '@/components/dashboard/user-profile-card'
import { PredictionHistoryPanel } from '@/components/dashboard/prediction-history-panel'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { MedicationReminder } from '@/components/dashboard/medication-reminder'
import { DrugInteractionChecker } from '@/components/dashboard/drug-interaction-checker'
import { BMICalculator } from '@/components/dashboard/bmi-calculator'
import { HealthScoreTimeline } from '@/components/dashboard/health-score-timeline'
import { HealthAssessmentScore } from '@/components/dashboard/health-assessment-score'
import { WaterIntakeTracker } from '@/components/dashboard/water-intake-tracker'
import { SymptomDurationTracker } from '@/components/dashboard/symptom-duration-tracker'
import { HealthTips } from '@/components/dashboard/health-tips'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  Activity, HeartPulse, Pill, Droplet, Stethoscope, Calculator,
  TrendingUp, Calendar, ShieldCheck, Printer, Sparkles, HelpCircle,
  FileText, Clock, AlertTriangle, ArrowUpRight, CheckCircle2
} from 'lucide-react'

type DashboardSectionKey = 'history' | 'medications' | 'biometrics' | 'wellness'

export default function DashboardTab() {
  const { user, history, predictions } = useAppStore()
  const [activePillar, setActivePillar] = useState<DashboardSectionKey>('history')
  const [isDossierOpen, setIsDossierOpen] = useState(false)

  // Calculations for KPI cards
  const latestPrediction = history[0]?.results?.[0] || predictions[0] || null
  const latestScore = latestPrediction?.similarityScore ?? latestPrediction?.confidence ?? 78
  const latestCondition = latestPrediction?.disease || 'No Recent Triage'
  const latestSpecialist = latestPrediction?.specialist || 'General Physician'

  const PILLARS: {
    key: DashboardSectionKey
    label: string
    sublabel: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }[] = [
    {
      key: 'history',
      label: 'Clinical History & Diagnostics',
      sublabel: 'Past screenings, pattern analytics & database stats',
      icon: Stethoscope,
      badge: `${history.length} Screenings`,
    },
    {
      key: 'medications',
      label: 'Pharmacotherapy & Safety',
      sublabel: 'Daily dosage alarms & drug interaction matrix',
      icon: Pill,
    },
    {
      key: 'biometrics',
      label: 'Biometrics & Vitality',
      sublabel: 'BMI assessment, vitality score & health timeline',
      icon: Calculator,
    },
    {
      key: 'wellness',
      label: 'Daily Habits & Wellness',
      sublabel: 'Hydration velocity, symptom duration & advice',
      icon: Droplet,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Executive Patient Identification Banner */}
        <UserProfileCard onExportDossier={() => setIsDossierOpen(true)} />

        {/* 2. Top Hero Metric KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Overall Vitality */}
          <Card className="border-border/60 glass-card shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Vitality Index
                </span>
                <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <HeartPulse className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground font-mono">88</span>
                <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
                <Badge variant="outline" className="ml-auto text-[10px] font-bold text-emerald-600 border-emerald-500/30 bg-emerald-500/5">
                  Optimal
                </Badge>
              </div>
              <div className="mt-3 space-y-1">
                <Progress value={88} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>Recovery trajectory</span>
                  <span className="text-emerald-600 font-medium">+4% this week</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2: Active Pharmacotherapy */}
          <Card className="border-border/60 glass-card shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Medications
                </span>
                <div className="size-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Pill className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground font-mono">2</span>
                <span className="text-xs text-muted-foreground">Regimens</span>
                <Badge variant="outline" className="ml-auto text-[10px] font-bold text-teal-600 border-teal-500/30 bg-teal-500/5">
                  Scheduled
                </Badge>
              </div>
              <div className="mt-3 space-y-1">
                <Progress value={100} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>Adherence rate</span>
                  <span className="text-teal-600 font-medium">100% on track</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3: Hydration Velocity */}
          <Card className="border-border/60 glass-card shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Daily Hydration
                </span>
                <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Droplet className="size-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-foreground font-mono">1,750</span>
                <span className="text-xs text-muted-foreground">/ 2,500 mL</span>
                <Badge variant="outline" className="ml-auto text-[10px] font-bold text-blue-600 border-blue-500/30 bg-blue-500/5">
                  70%
                </Badge>
              </div>
              <div className="mt-3 space-y-1">
                <Progress value={70} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>Target remaining</span>
                  <span className="text-blue-600 font-medium">750 mL</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* KPI 4: Latest Clinical Screening */}
          <Card className="border-border/60 glass-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Latest Triage Check
                </span>
                <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Activity className="size-5" />
                </div>
              </div>
              <div className="truncate">
                <h4 className="text-xl font-bold text-foreground truncate">
                  {latestCondition}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground truncate">{latestSpecialist}</span>
                  <Badge variant="secondary" className="text-[10px] font-mono font-bold bg-primary/10 text-primary">
                    {latestScore}% Match
                  </Badge>
                </div>
              </div>
              <div className="mt-3 border-t border-border/40 pt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Dual-Engine Inferred</span>
                <Link href="/checker" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
                  New Check <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Segmented Command Center Tabs */}
        <div className="space-y-6">
          <div className="bg-card/70 border border-border/70 p-1.5 rounded-2xl shadow-sm backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon
                const isActive = activePillar === pillar.key

                return (
                  <button
                    key={pillar.key}
                    type="button"
                    onClick={() => setActivePillar(pillar.key)}
                    className={`relative p-3 sm:p-3.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-muted text-primary'}`}>
                        <Icon className="size-4" />
                      </div>
                      {pillar.badge && (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-2 py-0.5 ${
                            isActive ? 'bg-primary-foreground/20 text-primary-foreground border-transparent' : 'bg-muted text-foreground'
                          }`}
                        >
                          {pillar.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm tracking-tight leading-snug">
                        {pillar.label}
                      </div>
                      <div className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {pillar.sublabel}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Tab Content Panels */}
          <AnimatePresence mode="wait">
            {activePillar === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <PredictionHistoryPanel />
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                  <DashboardCharts />
                  <QuickStats />
                </div>
              </motion.div>
            )}

            {activePillar === 'medications' && (
              <motion.div
                key="medications"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-2 gap-6 items-start"
              >
                <MedicationReminder />
                <DrugInteractionChecker />
              </motion.div>
            )}

            {activePillar === 'biometrics' && (
              <motion.div
                key="biometrics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-2 gap-6 items-start"
              >
                <BMICalculator />
                <HealthScoreTimeline />
                <div className="lg:col-span-2">
                  <HealthAssessmentScore />
                </div>
              </motion.div>
            )}

            {activePillar === 'wellness' && (
              <motion.div
                key="wellness"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="grid lg:grid-cols-2 gap-6 items-start"
              >
                <WaterIntakeTracker />
                <SymptomDurationTracker />
                <div className="lg:col-span-2">
                  <HealthTips />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 5. Health Dossier Export Dialog */}
      <Dialog open={isDossierOpen} onOpenChange={setIsDossierOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 pr-6">
              <div>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="size-6 text-primary" />
                  Clinical Health Dossier Summary
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Confidential patient summary generated by Smart.Dr Health Intelligence
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* Header Stamp */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/30 flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h4 className="font-bold text-base text-foreground">{user?.name || 'Patient'}</h4>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Patient ID: <span className="font-mono font-bold text-foreground">#SD-{(user?.id || '9482').slice(-4).toUpperCase()}</span>
                </p>
              </div>
              <div className="sm:text-right space-y-1">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Generated: {new Date().toLocaleDateString()}
                </Badge>
                <p className="text-xs text-muted-foreground">Demographics: {user?.age || 29} yrs • {user?.gender || 'Female'} • Blood: {user?.bloodGroup || 'O+'}</p>
              </div>
            </div>

            {/* Vitality Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">Vitality Index</span>
                <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">88/100</div>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">Latest Triage</span>
                <div className="text-base font-bold text-primary truncate mt-0.5">{latestCondition}</div>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-xs text-muted-foreground">Similarity</span>
                <div className="text-xl font-bold font-mono text-foreground mt-0.5">{latestScore}%</div>
              </div>
            </div>

            {/* Consultations logged */}
            <div>
              <h5 className="font-bold uppercase tracking-wider text-xs text-muted-foreground mb-2">
                Recent Clinical Consultations ({history.length})
              </h5>
              <div className="space-y-2">
                {history.slice(0, 3).map((h) => (
                  <div key={h.id} className="p-2.5 rounded-lg border bg-muted/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-foreground">{h.results?.[0]?.disease || 'Screening'}</span>
                      <span className="text-muted-foreground ml-2">({new Date(h.createdAt).toLocaleDateString()})</span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {h.results?.[0]?.similarityScore ?? h.results?.[0]?.confidence ?? 75}% Pattern Similarity
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>
                This dossier is an informational decision-support summary and does not constitute a formal prescription. In emergencies, dial 1122 or 911 immediately.
              </span>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1.5"
              >
                <Printer className="size-4" />
                <span>Print Document</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setIsDossierOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
