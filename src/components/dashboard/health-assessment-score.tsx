'use client'

import React, { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HeartPulse } from 'lucide-react'

export function HealthAssessmentScore() {
  const { user, history } = useAppStore()
  const [bmiValue, setBmiValue] = useState<number | null>(null)

  const score = useMemo(() => {
    let s = 70
    if (bmiValue) {
      if (bmiValue >= 18.5 && bmiValue < 25) s += 15
      else if (bmiValue >= 25 && bmiValue < 30) s -= 5
      else if (bmiValue < 18.5) s -= 10
      else s -= 15
    }
    if (history.length === 0) s += 10
    else if (history.length <= 3) s += 5
    else if (history.length <= 10) s -= 5
    else s -= 10
    return Math.max(0, Math.min(100, s))
  }, [bmiValue, history.length])

  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const scoreLabel = score >= 70 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Attention'
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="size-5 text-primary" />
          Health Assessment
        </CardTitle>
        <CardDescription>Your overall health score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative size-36">
            <svg className="circular-progress size-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: scoreColor }}>{score}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <Badge variant="outline" className="mt-3" style={{ borderColor: scoreColor, color: scoreColor }}>
            {scoreLabel}
          </Badge>

          <div className="w-full mt-4 space-y-2">
            <Label className="text-xs text-muted-foreground">Enter your BMI for better assessment</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="e.g. 22.5"
                value={bmiValue ?? ''}
                onChange={(e) => setBmiValue(e.target.value ? parseFloat(e.target.value) : null)}
                className="text-sm"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Score based on BMI, prediction history, and health patterns
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
