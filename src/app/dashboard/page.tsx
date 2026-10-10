'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAppStore, type User, type HistoryPrediction } from '@/lib/store'
import DashboardTab from '@/components/dashboard/dashboard-tab'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Lock, Sparkles, UserCheck, Stethoscope, ArrowRight,
  ShieldCheck, Activity, HeartPulse, LogIn, KeyRound
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const { user, setUser, setHistory } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Demo Patient loader
  const handleLoadDemoPatient = () => {
    const demoUser: User = {
      id: 'demo-patient-9482',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      age: 29,
      gender: 'female',
      bloodGroup: 'O+',
    }

    const demoHistory: HistoryPrediction[] = [
      {
        id: 'demo-pred-01',
        selectedSymptoms: ['Persistent Cough', 'Chest Discomfort', 'Fatigue', 'Low-Grade Fever'],
        results: [
          {
            disease: 'Bronchitis',
            similarityScore: 78,
            confidence: 78,
            description: 'Inflammation of the bronchial tube lining resulting in persistent airway cough and mucus congestion.',
            specialist: 'Pulmonologist',
            severity: 'MODERATE',
            treatmentOverview: 'Supportive recovery with aggressive hydration, vapor humidification, and rest.',
            precautions: ['Avoid secondhand smoke exposure', 'Use cool mist humidifier', 'Rest during acute febrile phases'],
            medications: ['Cough suppressant (Guaifenesin)', 'Albuterol inhaler (if prescribed)'],
            diet: ['Warm ginger tea with raw honey', 'Citrus fruits & vitamin C', 'Electrolyte broths'],
            workout: ['Controlled thoracic breathing', 'Gentle indoor walking', 'Avoid cold air exertion'],
            emergencyWarnings: ['Cyanosis of lips or fingertips', 'Resting dyspnea (shortness of breath)'],
            matchedSymptoms: ['Persistent Cough', 'Chest Discomfort', 'Fatigue'],
            totalSymptoms: 8,
            contributingSymptoms: [
              { name: 'Persistent Cough', importance: 'HALLMARK', score: 85 },
              { name: 'Chest Discomfort', importance: 'COMMON', score: 65 },
              { name: 'Fatigue', importance: 'COMMON', score: 55 }
            ],
            absentHallmarks: [
              { name: 'Sputum Production', importance: 'HALLMARK' }
            ],
            algorithmVersion: 'v2.1-weighted-profile'
          }
        ],
        llmAnalysis: '### Clinical Summary\nPresentation correlates strongly with acute lower airway bronchial inflammation.\n\n### Triage Recommendation\nPatient is advised to maintain hydration and avoid irritants. Consult Pulmonologist if cough persists past 14 days.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'demo-pred-02',
        selectedSymptoms: ['Headache', 'Mild Photophobia', 'Neck Stiffness'],
        results: [
          {
            disease: 'Migraine',
            similarityScore: 82,
            confidence: 82,
            description: 'Neurological cephalalgia characterized by recurrent throbbing headache attacks.',
            specialist: 'Neurologist',
            severity: 'MODERATE',
            treatmentOverview: 'Dark quiet room rest, hydration, avoidance of known dietary triggers.',
            precautions: ['Rest in dark, quiet environment', 'Hydrate adequately', 'Maintain consistent sleep patterns'],
            medications: ['Paracetamol / Ibuprofen (mild)', 'Triptans (as directed by physician)'],
            diet: ['Magnesium-rich foods (spinach, pumpkin seeds)', 'Avoid aged cheeses and red wine'],
            workout: ['Progressive muscle relaxation', 'Avoid strenuous workouts during attack'],
            emergencyWarnings: ['Sudden thunderclap headache', 'New neurological weakness or speech arrest'],
            matchedSymptoms: ['Headache', 'Mild Photophobia'],
            totalSymptoms: 6,
            contributingSymptoms: [
              { name: 'Headache', importance: 'HALLMARK', score: 90 },
              { name: 'Mild Photophobia', importance: 'COMMON', score: 70 }
            ],
            absentHallmarks: [
              { name: 'Unilateral Throbbing', importance: 'HALLMARK' }
            ],
            algorithmVersion: 'v2.1-weighted-profile'
          }
        ],
        llmAnalysis: '### Clinical Summary\nNeurovascular headache profile observed. Recommend logging trigger diary.',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      }
    ]

    setUser(demoUser)
    setHistory(demoHistory)
    toast({
      title: 'Demo Patient Loaded',
      description: 'Loaded profile for Sarah Jenkins (29 yrs, Female, O+) with sample clinical history.',
    })
  }

  // Quick Guest Mode
  const handleContinueAsGuest = () => {
    const guestUser: User = {
      id: `guest-${Date.now().toString().slice(-4)}`,
      name: 'Guest Patient',
      email: 'guest@smartdr.local',
      age: 30,
      gender: 'undisclosed',
      bloodGroup: 'Unknown',
    }
    setUser(guestUser)
    toast({
      title: 'Guest Mode Activated',
      description: 'Biometric and wellness trackers will save locally in your browser.',
    })
  }

  // Live Login API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ title: 'Validation Error', description: 'Please enter both email and password.', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      setUser(data.user)
      toast({ title: 'Welcome Back!', description: `Signed in as ${data.user.name}` })
    } catch (err: any) {
      toast({ title: 'Authentication Failed', description: err.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If user is authenticated or demo/guest mode is active, show the master dashboard!
  if (user) {
    return <DashboardTab />
  }

  return (
    <div className="min-h-[85vh] py-12 md:py-20 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative">
        <div className="text-center mb-10 space-y-3">
          <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary bg-primary/5 px-3 py-1">
            <HeartPulse className="size-3.5" />
            Patient Health Command Center
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Personal Health Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Access confidential screening history, track biometrics & BMI, monitor medication schedules, and audit AI differential consultations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Option 1: Demo / Instant Access */}
          <Card className="border-border/70 shadow-lg glass-card flex flex-col justify-between hover:border-primary/40 transition-all">
            <CardHeader className="pb-4">
              <div className="size-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-3 shadow-md">
                <Sparkles className="size-6" />
              </div>
              <CardTitle className="text-xl font-bold">Explore Patient Dossier (Demo)</CardTitle>
              <CardDescription>
                Experience the full state-of-the-art dashboard instantly with a pre-configured clinical profile, history, and trackers.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-muted-foreground">Sample Patient:</span>
                  <span className="font-bold text-foreground">Sarah Jenkins (29 yrs, O+)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Preloaded Data:</span>
                  <span className="text-primary font-medium">Bronchitis & Migraine Screenings</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Privacy Protection:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    Zero-PHI Ready
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleLoadDemoPatient}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-primary text-white font-semibold gap-2 shadow-md hover:opacity-95 h-11"
              >
                <Sparkles className="size-4" />
                <span>Launch Demo Patient Dossier</span>
                <ArrowRight className="size-4 ml-auto" />
              </Button>

              <div className="text-center pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleContinueAsGuest}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Or Continue as Local Guest (No Sample History)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Option 2: Live Sign In Form */}
          <Card className="border-border/70 shadow-lg glass-card flex flex-col justify-between hover:border-primary/40 transition-all">
            <CardHeader className="pb-4">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <LogIn className="size-6" />
              </div>
              <CardTitle className="text-xl font-bold">Sign In to Your Account</CardTitle>
              <CardDescription>
                Authenticate to sync your persistent health consultations across devices.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dash-email" className="text-xs font-semibold">Email Address</Label>
                  <Input
                    id="dash-email"
                    type="email"
                    placeholder="patient@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-muted/30 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dash-password" className="text-xs font-semibold">Password</Label>
                  <Input
                    id="dash-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-muted/30 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-semibold gap-2 h-11 shadow-sm"
                >
                  <KeyRound className="size-4" />
                  <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                </Button>

                <p className="text-[11px] text-center text-muted-foreground pt-1">
                  Don&apos;t have an account? Use the <strong>Demo Patient Dossier</strong> above or register via the navigation bar.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
