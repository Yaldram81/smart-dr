'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertTriangle, Clock, Plus, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useHydrated } from '@/components/hooks/use-hydrated'
import type { TrackedSymptom } from '@/components/types'

const COMMON_SYMPTOMS = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Chest Pain',
  'Sore Throat', 'Runny Nose', 'Dizziness', 'Muscle Pain',
  'Shortness of Breath', 'Abdominal Pain', 'Joint Pain', 'Vomiting',
]

export function SymptomDurationTracker() {
  const STORAGE_KEY = 'medpredict_symptom_duration'
  const hydrated = useHydrated()
  const [trackedSymptoms, setTrackedSymptoms] = useState<TrackedSymptom[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored) as TrackedSymptom[]
    } catch {
      // ignore
    }
    return []
  })
  const [selectedSymptom, setSelectedSymptom] = useState('')
  const [duration, setDuration] = useState('1')

  // Save to localStorage on change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedSymptoms))
    } catch {
      // ignore
    }
  }, [trackedSymptoms, hydrated])

  const addSymptom = () => {
    if (!selectedSymptom || !duration) return
    const numDuration = parseInt(duration, 10)
    if (isNaN(numDuration) || numDuration < 1) return

    // Check if already tracked
    if (trackedSymptoms.some(s => s.name === selectedSymptom)) {
      toast({ title: 'Already tracked', description: `${selectedSymptom} is already in your list.`, variant: 'destructive' })
      return
    }

    const newSymptom: TrackedSymptom = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: selectedSymptom,
      duration: numDuration,
      addedAt: Date.now(),
    }
    setTrackedSymptoms(prev => [...prev, newSymptom])
    setSelectedSymptom('')
    setDuration('1')
    toast({ title: 'Symptom tracked', description: `${newSymptom.name} for ${numDuration} day${numDuration > 1 ? 's' : ''}` })
  }

  const removeSymptom = (id: string) => {
    setTrackedSymptoms(prev => prev.filter(s => s.id !== id))
  }

  if (!hydrated) {
    return (
      <Card className="dashboard-card glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Symptom Duration Tracker
          </CardTitle>
          <CardDescription>Track how long your symptoms persist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dashboard-card glass-card hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-5 text-primary" />
          Symptom Duration Tracker
        </CardTitle>
        <CardDescription>Track how long your symptoms persist</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add symptom form */}
        <div className="flex gap-2">
          <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select symptom..." />
            </SelectTrigger>
            <SelectContent>
              {COMMON_SYMPTOMS.filter(s => !trackedSymptoms.some(t => t.name === s)).map(symptom => (
                <SelectItem key={symptom} value={symptom}>{symptom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="w-24">
            <Input
              type="number"
              min={1}
              max={365}
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="Days"
            />
          </div>
          <Button
            size="icon"
            onClick={addSymptom}
            disabled={!selectedSymptom || !duration}
            className="shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Tracked symptoms list */}
        {trackedSymptoms.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="size-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No symptoms tracked yet</p>
            <p className="text-xs text-muted-foreground mt-1">Select a symptom and duration above to start tracking</p>
          </div>
        ) : (
          <ScrollArea className="max-h-64 custom-scrollbar">
            <div className="space-y-2">
              {trackedSymptoms.map(symptom => (
                <div
                  key={symptom.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    symptom.duration > 7
                      ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      : 'bg-muted/50 border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {symptom.duration > 7 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent>Duration exceeds 7 days — consider consulting a doctor</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    <span className="text-sm font-medium truncate">{symptom.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={symptom.duration > 7 ? 'destructive' : 'secondary'} className="text-xs">
                      {symptom.duration} day{symptom.duration !== 1 ? 's' : ''}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeSymptom(symptom.id)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
