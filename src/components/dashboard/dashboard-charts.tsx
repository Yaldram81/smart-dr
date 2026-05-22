'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, ClipboardList } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'

const SEVERITY_COLORS: Record<string, string> = {
  mild: '#10b981',
  moderate: '#f59e0b',
  severe: '#ef4444',
}

export function DashboardCharts() {
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

  const severityData = useMemo(() => {
    if (!stats?.severityCount) return []
    return Object.entries(stats.severityCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
      color: SEVERITY_COLORS[name.toLowerCase()] || '#6b7280',
    }))
  }, [stats])

  const categoryData = useMemo(() => {
    if (!stats?.categoryCount) return []
    return Object.entries(stats.categoryCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([name, count]) => ({ name, count: count as number }))
  }, [stats])

  const renderPieLabel = useCallback(({ name, percent }: { name: string; percent: number }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`
  }, [])

  if (loading) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              Severity Distribution
            </CardTitle>
            <CardDescription>Disease severity breakdown</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" />
              Disease Categories
            </CardTitle>
            <CardDescription>Symptoms per category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      {/* Severity Distribution Pie Chart */}
      <Card className="dashboard-card glass-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Severity Distribution
          </CardTitle>
          <CardDescription>Disease severity breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {severityData.length === 0 ? (
            <div className="text-center py-6">
              <Activity className="size-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No severity data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.91 0.01 155)', fontSize: '13px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Disease Categories Bar Chart */}
      <Card className="dashboard-card glass-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" />
            Disease Categories
          </CardTitle>
          <CardDescription>Symptoms per category</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="text-center py-6">
              <ClipboardList className="size-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No category data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(200, categoryData.length * 40)}>
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.91 0.01 155)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 155)" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 155)" />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid oklch(0.91 0.01 155)', fontSize: '13px' }}
                />
                <Bar dataKey="count" fill="oklch(0.55 0.17 160)" radius={[0, 6, 6, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
