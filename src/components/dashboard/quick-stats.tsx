'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, ClipboardList, ShieldCheck, User as UserIcon, Zap } from 'lucide-react'

export function QuickStats() {
  const [stats, setStats] = useState<{
    diseaseCount: number
    symptomCount: number
    predictionCount: number
    userCount: number
    categoryCount: Record<string, number>
    severityCount: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        setStats(data)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const statItems = [
    { value: stats?.diseaseCount || 0, label: 'Diseases', icon: <ShieldCheck className="size-4 text-primary" />, color: 'text-primary', bg: 'bg-primary/5' },
    { value: stats?.symptomCount || 0, label: 'Symptoms', icon: <ClipboardList className="size-4 text-teal-600" />, color: 'text-teal-600', bg: 'bg-teal-500/5' },
    { value: stats?.predictionCount || 0, label: 'Predictions', icon: <Zap className="size-4 text-emerald-600" />, color: 'text-emerald-600', bg: 'bg-emerald-500/5' },
    { value: stats?.userCount || 0, label: 'Users', icon: <UserIcon className="size-4 text-green-600" />, color: 'text-green-600', bg: 'bg-green-500/5' },
  ]

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {statItems.map((stat) => (
            <div key={stat.label} className={`p-3 rounded-lg ${stat.bg} text-center hover:bg-primary/10 transition-colors`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {stat.icon}
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        {stats?.severityCount && Object.keys(stats.severityCount).length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-xs text-muted-foreground">Severity Distribution</Label>
            {Object.entries(stats.severityCount).map(([sev, count]) => (
              <div key={sev} className="flex items-center gap-2">
                <span className="text-xs w-16 capitalize">{sev}</span>
                <Progress value={(count / (stats?.diseaseCount || 1)) * 100} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">{count as number}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
