'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useAppStore, type HistoryPrediction, type PredictionResult } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import {
  History, Search, Clock, Stethoscope, ChevronRight, AlertTriangle,
  ShieldAlert, Sparkles, Filter, Trash2, Printer, Pill, ShieldCheck
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function PredictionHistoryPanel() {
  const { user, history, setHistory } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [selectedPrediction, setSelectedPrediction] = useState<HistoryPrediction | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    if (!user || user.id.startsWith('demo-')) return
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/history?userId=${user.id}&limit=20`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.predictions)) {
            setHistory(data.predictions)
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user, setHistory])

  // Filtered prediction list
  const filteredHistory = useMemo(() => {
    return history.filter((pred) => {
      const topResult = pred.results?.[0]
      const diseaseName = topResult?.disease?.toLowerCase() || ''
      const symptoms = Array.isArray(pred.selectedSymptoms)
        ? pred.selectedSymptoms.join(' ').toLowerCase()
        : ''
      const matchesSearch =
        diseaseName.includes(searchQuery.toLowerCase()) ||
        symptoms.includes(searchQuery.toLowerCase())

      const predSeverity = (topResult?.severity || 'moderate').toLowerCase()
      const matchesSeverity =
        severityFilter === 'all' || predSeverity === severityFilter.toLowerCase()

      return matchesSearch && matchesSeverity
    })
  }, [history, searchQuery, severityFilter])

  const handleDeletePrediction = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this clinical screening record?')) return

    try {
      if (!id.startsWith('demo-')) {
        await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      }
      setHistory(history.filter((h) => h.id !== id))
      if (selectedPrediction?.id === id) {
        setIsDetailOpen(false)
      }
      toast({ title: 'Record Deleted', description: 'Screening history updated.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete record.', variant: 'destructive' })
    }
  }

  const getSeverityBadgeClass = (severity?: string) => {
    const s = String(severity || '').toUpperCase()
    if (s === 'CRITICAL') return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
    if (s === 'SEVERE') return 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
    if (s === 'MODERATE') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
    return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  }

  if (loading) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Clinical Screening History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border/60 shadow-md glass-card hover:border-primary/20 transition-all">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <History className="size-5 text-primary" />
                Clinical Screening History & Triage Records
              </CardTitle>
              <CardDescription className="mt-1">
                Historical record of your symptom checks, pattern similarity, and differential analyses
              </CardDescription>
            </div>

            <Link href="/checker">
              <Button size="sm" variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                <Stethoscope className="size-3.5" />
                <span>New Screening</span>
              </Button>
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3">
            <div className="relative flex-1">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter by condition or symptom name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-muted/40"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'mild', 'moderate', 'severe', 'critical'].map((sev) => (
                <Button
                  key={sev}
                  type="button"
                  size="sm"
                  variant={severityFilter === sev ? 'default' : 'outline'}
                  onClick={() => setSeverityFilter(sev)}
                  className={`text-xs h-8 px-2.5 capitalize ${
                    severityFilter === sev ? 'shadow-sm' : 'border-border/60 text-muted-foreground'
                  }`}
                >
                  {sev}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed rounded-xl border-border/70 bg-muted/20">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Stethoscope className="size-6" />
              </div>
              <h4 className="font-semibold text-base">No Screening Records Found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
                {searchQuery || severityFilter !== 'all'
                  ? 'No past screenings match your search filters. Try clearing search keywords.'
                  : 'You have not performed any symptom screenings yet. Start an interactive evaluation to log your first record.'}
              </p>
              <Link href="/checker">
                <Button size="sm" className="gap-1.5">
                  <Stethoscope className="size-4" />
                  <span>Start Symptom Checker</span>
                </Button>
              </Link>
            </div>
          ) : (
            <ScrollArea className="max-h-[460px] pr-2 custom-scrollbar">
              <div className="space-y-3">
                {filteredHistory.map((pred: HistoryPrediction) => {
                  const topResult = pred.results?.[0]
                  const simScore =
                    topResult?.similarityScore ?? topResult?.confidence ?? 65

                  return (
                    <div
                      key={pred.id}
                      onClick={() => {
                        setSelectedPrediction(pred)
                        setIsDetailOpen(true)
                      }}
                      className="group p-4 rounded-xl border border-border/70 hover:border-primary/40 bg-card hover:bg-muted/40 transition-all cursor-pointer relative shadow-sm hover:shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                            {topResult?.disease || 'Undifferentiated Condition'}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider ${getSeverityBadgeClass(
                              topResult?.severity
                            )}`}
                          >
                            {topResult?.severity || 'MODERATE'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="size-3" />
                            {new Date(pred.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-1"
                            onClick={(e) => handleDeletePrediction(pred.id, e)}
                            title="Delete this record"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Specialist Chip & Matched Symptoms */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {topResult?.specialist && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary font-medium">
                            {topResult.specialist}
                          </Badge>
                        )}
                        {(Array.isArray(pred.selectedSymptoms) ? pred.selectedSymptoms : []).slice(0, 4).map((sym: string, j: number) => (
                          <Badge key={j} variant="outline" className="text-[11px] font-normal bg-muted/40">
                            {sym}
                          </Badge>
                        ))}
                        {(Array.isArray(pred.selectedSymptoms) ? pred.selectedSymptoms : []).length > 4 && (
                          <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
                            +{(pred.selectedSymptoms as string[]).length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Pattern Similarity Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground text-[11px]">Symptom Pattern Similarity:</span>
                          <span className="font-bold text-foreground font-mono">{simScore}%</span>
                        </div>
                        <Progress value={simScore} className="h-2 rounded-full" />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-2">
                        <span>Click to inspect full clinical differential & absent hallmarks</span>
                        <ChevronRight className="size-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Clinical Inspection Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedPrediction && (() => {
            const topResult = selectedPrediction.results?.[0]
            const simScore = topResult?.similarityScore ?? topResult?.confidence ?? 65

            return (
              <div className="space-y-5">
                <DialogHeader>
                  <div className="flex items-center justify-between gap-3 pr-6">
                    <div>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>{topResult?.disease || 'Condition Details'}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs uppercase font-bold ${getSeverityBadgeClass(
                            topResult?.severity
                          )}`}
                        >
                          {topResult?.severity || 'MODERATE'}
                        </Badge>
                      </DialogTitle>
                      <DialogDescription className="mt-1">
                        Screening logged on {new Date(selectedPrediction.createdAt).toLocaleString()} • Specialist: {topResult?.specialist || 'General Physician'}
                      </DialogDescription>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-primary font-mono">{simScore}%</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Similarity</div>
                    </div>
                  </div>
                </DialogHeader>

                {/* Description */}
                {topResult?.description && (
                  <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    {topResult.description}
                  </div>
                )}

                {/* Contributing Symptoms */}
                {topResult?.contributingSymptoms && topResult.contributingSymptoms.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      Contributing Reported Indicators
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {topResult.contributingSymptoms.map((c, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs flex items-center justify-between">
                          <span className="font-medium text-foreground">{c.name}</span>
                          <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600">
                            {c.importance}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Absent Hallmarks */}
                {topResult?.absentHallmarks && topResult.absentHallmarks.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="size-4 text-amber-600" />
                      Expected Hallmarks Not Reported (Negative Evidence)
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {topResult.absentHallmarks.map((a, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs flex items-center justify-between">
                          <span className="text-foreground/80">{a.name}</span>
                          <span className="text-[10px] text-muted-foreground italic">Expected</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precautions */}
                {topResult?.precautions && topResult.precautions.length > 0 && (
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Recommended Precautions
                    </h5>
                    <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                      {topResult.precautions.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* LLM Differential Notes */}
                {selectedPrediction.llmAnalysis && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      AI Clinical Differential Consultation
                    </h5>
                    <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                      {selectedPrediction.llmAnalysis}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="gap-1.5 text-xs"
                  >
                    <Printer className="size-3.5" />
                    <span>Print Consultation</span>
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsDetailOpen(false)}
                    className="text-xs"
                  >
                    Close Record
                  </Button>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </>
  )
}
