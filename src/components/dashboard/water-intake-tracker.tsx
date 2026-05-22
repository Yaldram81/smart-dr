'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, GlassWater, Minus, Plus } from 'lucide-react'
import { useHydrated } from '@/components/hooks/use-hydrated'

export function WaterIntakeTracker() {
  const DAILY_GOAL = 8
  const STORAGE_KEY = 'medpredict_water_intake'
  const hydrated = useHydrated()

  const [glasses, setGlasses] = useState(() => {
    if (typeof window === 'undefined') return 0
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return 0
      const data = JSON.parse(stored)
      const today = new Date().toDateString()
      if (data.date !== today) return 0
      return data.count
    } catch {
      return 0
    }
  })

  const persistGlasses = (count: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: new Date().toDateString(),
        count,
      }))
    } catch {
      // ignore
    }
  }

  const progress = Math.min((glasses / DAILY_GOAL) * 100, 100)
  const waterLevel = Math.min(glasses / DAILY_GOAL, 1)

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-sky-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlassWater className="size-5 text-sky-500" />
          Water Intake
        </CardTitle>
        <CardDescription>Track your daily hydration goal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Visual water glass */}
          <div className="relative size-24 shrink-0">
            <div className="absolute inset-0 rounded-b-2xl rounded-t-md border-2 border-sky-300 dark:border-sky-700 overflow-hidden bg-sky-50 dark:bg-sky-950/30">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-400 to-sky-300 dark:from-sky-600 dark:to-sky-500"
                initial={{ height: 0 }}
                animate={{ height: `${waterLevel * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ borderRadius: '0 0 6px 6px' }}
              />
              {/* Water surface wave */}
              {glasses > 0 && (
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-sky-200/60 dark:bg-sky-400/40"
                  style={{ top: `${(1 - waterLevel) * 100}%` }}
                  animate={{ y: [-1, 1, -1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-lg font-bold text-sky-700 dark:text-sky-200">{glasses}</span>
            </div>
          </div>

          {/* Controls & stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-9 border-sky-300 dark:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/30"
                onClick={() => { const n = Math.max(0, glasses - 1); setGlasses(n); persistGlasses(n) }}
                disabled={glasses <= 0}
              >
                <Minus className="size-4 text-sky-600" />
              </Button>
              <Button
                size="icon"
                className="size-9 bg-sky-500 hover:bg-sky-600 text-white"
                onClick={() => { const n = glasses + 1; setGlasses(n); persistGlasses(n) }}
                disabled={glasses >= DAILY_GOAL * 2}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <div>
              <Progress value={progress} className="h-2 [&>div]:bg-sky-500" />
              <p className="text-xs text-muted-foreground mt-1">
                {glasses} / {DAILY_GOAL} glasses ({Math.round(progress)}%)
              </p>
            </div>
            {glasses >= DAILY_GOAL && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
              >
                <CheckCircle2 className="size-3" />
                Daily goal reached! 🎉
              </motion.p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
