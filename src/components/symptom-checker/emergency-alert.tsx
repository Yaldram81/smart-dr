'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useHydrated } from '@/components/hooks/use-hydrated'
import { Button } from '@/components/ui/button'
import { AlertOctagon, X } from 'lucide-react'

export function EmergencyAlert() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('emergency_alert_dismissed') === 'true'
  })
  const mounted = useHydrated()

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('emergency_alert_dismissed', 'true')
  }

  if (!mounted || dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 overflow-hidden"
    >
      <div className="flex items-start gap-3 p-4">
        <div className="shrink-0 mt-0.5">
          <div className="size-9 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <AlertOctagon className="size-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
            Emergency Warning
          </h3>
          <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
            If you&apos;re experiencing <strong>chest pain</strong>, <strong>difficulty breathing</strong>,{' '}
            <strong>severe bleeding</strong>, or <strong>signs of stroke</strong> (face drooping, arm weakness, speech difficulty),{' '}
            <strong>call emergency services immediately</strong>. This tool is not for emergencies.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 size-8 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
          onClick={handleDismiss}
          aria-label="Dismiss emergency alert"
        >
          <X className="size-4" />
        </Button>
      </div>
    </motion.div>
  )
}
