'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  AlertTriangle, Stethoscope, Search, Phone, ChevronDown, ChevronUp,
  Heart, Wind, Brain, Droplets, ShieldAlert, Siren
} from 'lucide-react'

const EMERGENCY_SYMPTOMS = [
  {
    icon: <Heart className="size-4 text-red-500" />,
    title: 'Chest Pain or Pressure',
    description: 'Sudden chest pain, tightness, or pressure that may radiate to the arm, jaw, or back.',
  },
  {
    icon: <Wind className="size-4 text-red-500" />,
    title: 'Difficulty Breathing',
    description: 'Severe shortness of breath, gasping, or inability to catch your breath.',
  },
  {
    icon: <Droplets className="size-4 text-red-500" />,
    title: 'Severe Bleeding',
    description: 'Uncontrolled or heavy bleeding that does not stop with direct pressure.',
  },
  {
    icon: <Brain className="size-4 text-red-500" />,
    title: 'Sudden Confusion',
    description: 'Sudden confusion, difficulty speaking, or understanding speech (signs of stroke).',
  },
  {
    icon: <AlertTriangle className="size-4 text-red-500" />,
    title: 'Severe Head Injury',
    description: 'Head injury with loss of consciousness, vomiting, or worsening headache.',
  },
  {
    icon: <ShieldAlert className="size-4 text-red-500" />,
    title: 'Seizures',
    description: 'First-time seizure or seizure lasting more than 5 minutes.',
  },
  {
    icon: <Heart className="size-4 text-red-500" />,
    title: 'Signs of Heart Attack',
    description: 'Chest discomfort, cold sweat, nausea, or lightheadedness.',
  },
  {
    icon: <Brain className="size-4 text-red-500" />,
    title: 'Signs of Stroke (FAST)',
    description: 'Face drooping, Arm weakness, Speech difficulty — Time to call emergency services.',
  },
  {
    icon: <AlertTriangle className="size-4 text-red-500" />,
    title: 'Severe Allergic Reaction',
    description: 'Anaphylaxis: swelling of throat, difficulty breathing, rapid pulse, or hives.',
  },
  {
    icon: <Droplets className="size-4 text-red-500" />,
    title: 'Severe Burns',
    description: 'Large or deep burns, burns on face, hands, feet, or genitals.',
  },
  {
    icon: <Siren className="size-4 text-red-500" />,
    title: 'Suicidal Thoughts',
    description: 'Immediate risk of self-harm. Call your local crisis helpline immediately.',
  },
]

export function EmergencyQuickActions() {
  const router = useRouter()
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background - red/amber theme for urgency */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-amber-500/8 to-red-600/10 dark:from-red-500/15 dark:via-amber-500/10 dark:to-red-600/15" />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-red-500/5" />

            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-red-500/10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-amber-500/10 blur-2xl" />

            {/* Content */}
            <div className="relative border border-red-500/20 dark:border-red-500/15 rounded-2xl p-5 md:p-7 glass-card">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="shrink-0 size-11 md:size-12 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/25"
                  >
                    <AlertTriangle className="size-5 md:size-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold">Emergency Quick Actions</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Quick access to critical health tools</p>
                  </div>
                </div>

                {/* Collapse toggle for mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden gap-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  aria-label={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
                </Button>
              </div>

              {/* Quick Action Buttons */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                      {/* Check Symptoms Now */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card
                          className="cursor-pointer group border-primary/20 hover:border-primary/40 transition-all hover:shadow-md bg-background/50"
                          onClick={() => router.push('/checker')}
                        >
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Stethoscope className="size-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Check Symptoms Now</p>
                              <p className="text-xs text-muted-foreground mt-0.5">AI-powered symptom analysis</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Emergency Symptoms */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <Card
                          className="cursor-pointer group border-red-500/20 hover:border-red-500/40 transition-all hover:shadow-md bg-background/50"
                          onClick={() => setShowEmergencyDialog(true)}
                        >
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                            <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                              <Siren className="size-5 text-red-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Emergency Symptoms</p>
                              <p className="text-xs text-muted-foreground mt-0.5">When to seek immediate help</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Find a Specialist */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <Card
                          className="cursor-pointer group border-amber-500/20 hover:border-amber-500/40 transition-all hover:shadow-md bg-background/50"
                          onClick={() => router.push('/checker')}
                        >
                          <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                            <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                              <Search className="size-5 text-amber-600 dark:text-amber-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Find a Specialist</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Get matched to the right doctor</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Emergency hotline notice */}
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <Phone className="size-4 text-red-500 shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-red-600 dark:text-red-400">In a life-threatening emergency?</span>{' '}
                        Call your local emergency number immediately (911, 112, 999, etc.)
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Emergency Symptoms Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="size-5 text-red-500" />
              Emergency Symptoms
            </DialogTitle>
            <DialogDescription>
              These symptoms require immediate medical attention. If you or someone else is experiencing any of these, seek emergency care right away.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            {EMERGENCY_SYMPTOMS.map((symptom, index) => (
              <motion.div
                key={symptom.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg border border-red-500/10 bg-red-500/[0.03]"
              >
                <div className="shrink-0 mt-0.5">{symptom.icon}</div>
                <div>
                  <p className="font-medium text-sm">{symptom.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{symptom.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Phone className="size-4 text-red-500" />
              <Badge variant="destructive" className="text-xs">Important</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Do not wait if you experience any of these symptoms. Call your local emergency number immediately. Early intervention can save lives.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowEmergencyDialog(false)}
            >
              Close
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              onClick={() => { setShowEmergencyDialog(false); router.push('/checker') }}
            >
              <Stethoscope className="size-4" />
              Check Symptoms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
