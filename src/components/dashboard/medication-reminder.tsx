'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlarmClock, Check, Loader2, Pill, Plus, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useHydrated } from '@/components/hooks/use-hydrated'
import type { MedicationEntry } from '@/components/types'

export function MedicationReminder() {
  const mounted = useHydrated()
  const [medications, setMedications] = useState<MedicationEntry[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('medpredict_medications')
      if (stored) {
        const parsed = JSON.parse(stored)
        const today = new Date().toISOString().split('T')[0]
        if (parsed.date !== today) {
          const resetMeds = parsed.medications.map((m: MedicationEntry) => ({ ...m, taken: false }))
          localStorage.setItem('medpredict_medications', JSON.stringify({ date: today, medications: resetMeds }))
          return resetMeds
        }
        return parsed.medications
      }
    } catch { /* ignore */ }
    return []
  })
  const [showForm, setShowForm] = useState(false)
  const [newMed, setNewMed] = useState({ name: '', dosage: '', time: '08:00' })

  // Save to localStorage
  const saveMedications = (meds: MedicationEntry[]) => {
    setMedications(meds)
    try {
      localStorage.setItem('medpredict_medications', JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        medications: meds,
      }))
    } catch { /* ignore */ }
  }

  const addMedication = () => {
    if (!newMed.name.trim()) {
      toast({ title: 'Missing info', description: 'Please enter a medication name', variant: 'destructive' })
      return
    }
    const entry: MedicationEntry = {
      id: Date.now().toString(),
      name: newMed.name.trim(),
      dosage: newMed.dosage.trim() || '1 dose',
      time: newMed.time,
      taken: false,
    }
    const updated = [...medications, entry].sort((a, b) => a.time.localeCompare(b.time))
    saveMedications(updated)
    setNewMed({ name: '', dosage: '', time: '08:00' })
    setShowForm(false)
    toast({ title: 'Medication added', description: `${entry.name} at ${entry.time}` })
  }

  const toggleTaken = (id: string) => {
    const updated = medications.map(m => m.id === id ? { ...m, taken: !m.taken } : m)
    saveMedications(updated)
  }

  const removeMedication = (id: string) => {
    const updated = medications.filter(m => m.id !== id)
    saveMedications(updated)
    toast({ title: 'Medication removed' })
  }

  const takenCount = medications.filter(m => m.taken).length

  return (
    <Card className="dashboard-card glass-card border-l-4 border-l-teal-500/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlarmClock className="size-5 text-teal-500" />
            Medication Reminder
          </CardTitle>
          {medications.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {takenCount}/{medications.length} taken
            </Badge>
          )}
        </div>
        <CardDescription>Track your daily medications</CardDescription>
      </CardHeader>
      <CardContent>
        {!mounted ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Progress bar */}
            {medications.length > 0 && (
              <div className="space-y-1">
                <Progress value={(takenCount / medications.length) * 100} className="h-2" />
                <p className="text-[10px] text-muted-foreground text-right">
                  {takenCount === medications.length && medications.length > 0
                    ? '✅ All medications taken!'
                    : `${medications.length - takenCount} remaining`}
                </p>
              </div>
            )}

            {/* Medication list */}
            <ScrollArea className="max-h-40 custom-scrollbar">
              <div className="space-y-2">
                {medications.map(med => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      med.taken
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-card border-border hover:border-primary/20'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaken(med.id)}
                      className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        med.taken
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                      aria-label={med.taken ? 'Mark as not taken' : 'Mark as taken'}
                    >
                      {med.taken && <Check className="size-3.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                        {med.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{med.dosage} • {med.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeMedication(med.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </motion.div>
                ))}
                {medications.length === 0 && (
                  <div className="text-center py-4">
                    <Pill className="size-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No medications added</p>
                    <p className="text-xs text-muted-foreground/60">Click the button below to add one</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Add medication form */}
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 pt-2 border-t"
              >
                <Input
                  placeholder="Medication name"
                  value={newMed.name}
                  onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                  className="h-9 text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Dosage (e.g., 500mg)"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                    className="h-9 text-sm"
                  />
                  <Input
                    type="time"
                    value={newMed.time}
                    onChange={(e) => setNewMed(prev => ({ ...prev, time: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-8 text-xs gap-1" onClick={addMedication}>
                    <Plus className="size-3" /> Add
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs gap-1.5 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => setShowForm(true)}
              >
                <Plus className="size-3.5" /> Add Medication
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
