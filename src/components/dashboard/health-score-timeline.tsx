'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, Loader2, TrendingUp } from 'lucide-react'
import { useHydrated } from '@/components/hooks/use-hydrated'

export function HealthScoreTimeline() {
  const mounted = useHydrated()

  // Use lazy state initialization to avoid setState in effect
  const [timelineData] = useState<{ day: string; score: number }[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('medpredict_health_timeline')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.date === new Date().toISOString().split('T')[0]) {
          return parsed.data
        }
      }
    } catch { /* ignore */ }
    // Generate simulated data for the past 7 days
    const today = new Date().getDay()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const data = Array.from({ length: 7 }).map((_, i) => {
      const dayIndex = (today - 6 + i + 7) % 7
      return {
        day: dayNames[dayIndex],
        score: Math.round(60 + Math.random() * 35),
      }
    })
    try {
      localStorage.setItem('medpredict_health_timeline', JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        data,
      }))
    } catch { /* ignore */ }
    return data
  })

  const maxScore = 100
  const avgScore = timelineData.length > 0
    ? Math.round(timelineData.reduce((sum, d) => sum + d.score, 0) / timelineData.length)
    : 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-rose-500'
  }

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <Card className="dashboard-card glass-card border-l-4 border-l-primary/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Health Score Timeline
          </CardTitle>
          {avgScore > 0 && (
            <Badge variant="outline" className={`text-xs font-semibold ${getScoreColor(avgScore)}`}>
              Avg: {avgScore}%
            </Badge>
          )}
        </div>
        <CardDescription>Your simulated health score over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {timelineData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mini chart bars */}
            <div className="flex items-end justify-between gap-2 h-32 px-1">
              {timelineData.map((item, i) => (
                <motion.div
                  key={item.day}
                  className="flex flex-col items-center gap-1 flex-1"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <span className={`text-xs font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                  <div className="w-full relative rounded-t-md overflow-hidden bg-muted">
                    <motion.div
                      className={`w-full rounded-t-md ${getBarColor(item.score)}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.score / maxScore) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                      style={{ minHeight: 4 }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{item.day}</span>
                </motion.div>
              ))}
            </div>
            {/* Trend indicator */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="size-3.5" />
                <span>
                  {timelineData.length >= 2 && timelineData[timelineData.length - 1].score > timelineData[0].score
                    ? 'Trending upward'
                    : timelineData.length >= 2 && timelineData[timelineData.length - 1].score < timelineData[0].score
                      ? 'Slight decline'
                      : 'Stable trend'}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/60">Simulated data</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
