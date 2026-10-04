'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useAppStore } from '@/lib/store'
import { Pill, AlertTriangle, ShieldCheck, Plus, X, Loader2, Info } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const COMMON_DRUGS = [
  'Paracetamol', 'Aspirin', 'Ibuprofen', 'Warfarin',
  'Metformin', 'Ciprofloxacin', 'Omeprazole', 'Atorvastatin'
]

export function DrugInteractionChecker() {
  const { language } = useAppStore()
  const [meds, setMeds] = useState<string[]>(['Aspirin', 'Ibuprofen'])
  const [inputVal, setInputVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    interactionsFound: boolean;
    knownInteractions: Array<{
      drugs: [string, string];
      severity: string;
      description: string;
      recommendation: string;
    }>;
    pharmacologicalAnalysis: string | null;
  } | null>(null)

  const addMed = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (meds.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: 'Already added', description: `${trimmed} is already in the check list.` })
      return
    }
    if (meds.length >= 6) {
      toast({ title: 'Limit reached', description: 'You can check up to 6 medications at once.' })
      return
    }
    setMeds([...meds, trimmed])
    setInputVal('')
    setResult(null)
  }

  const removeMed = (index: number) => {
    setMeds(meds.filter((_, i) => i !== index))
    setResult(null)
  }

  const handleCheck = async () => {
    if (meds.length < 2) {
      toast({
        title: 'Add more medications',
        description: 'Please add at least 2 medications to check for drug interactions.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: meds, language }),
      })
      if (!res.ok) throw new Error('Interaction check failed')
      const data = await res.json()
      setResult(data)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to verify drug interactions. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card border-border/60 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="size-5 text-primary" />
            {language === 'ur' ? 'ادویات کا باہمی تعامل (Drug Interactions)' : 'Drug Interaction Checker'}
          </CardTitle>
          <Badge variant="outline" className="text-xs">Clinical Safety</Badge>
        </div>
        <CardDescription>
          {language === 'ur'
            ? 'ایک وقت میں لی جانے والی ادویات کے ممکنہ خطرات اور باہمی نقصانات کی جانچ کریں'
            : 'Check if taking two or more medications together is clinically safe.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Medication Tag List */}
        <div className="flex flex-wrap gap-2 min-h-10 p-2.5 rounded-lg border bg-muted/30 items-center">
          {meds.map((m, i) => (
            <Badge key={i} variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs font-medium">
              <span>{m}</span>
              <button onClick={() => removeMed(i)} className="hover:text-destructive transition-colors">
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          {meds.length === 0 && (
            <span className="text-xs text-muted-foreground">Add at least two medications below...</span>
          )}
        </div>

        {/* Input & Quick Select */}
        <div className="flex gap-2">
          <Input
            placeholder="Type medication name (e.g. Paracetamol, Warfarin)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addMed(inputVal)
              }
            }}
            className="text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => addMed(inputVal)}
            className="gap-1 shrink-0"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-muted-foreground mr-1">Quick Add:</span>
          {COMMON_DRUGS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => addMed(d)}
              className="text-[11px] px-2 py-0.5 rounded-full border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              + {d}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleCheck}
          disabled={meds.length < 2 || loading}
          className="w-full gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Checking Pharmacology Database...
            </>
          ) : (
            <>
              <ShieldCheck className="size-4" />
              Check Interaction Safety
            </>
          )}
        </Button>

        {/* Results Area */}
        {result && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {result.interactionsFound ? (
              <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 space-y-2">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold text-sm">
                  <AlertTriangle className="size-4 shrink-0" />
                  Interaction Detected ({result.knownInteractions.length})
                </div>

                {result.knownInteractions.map((item, idx) => (
                  <div key={idx} className="bg-background/80 p-2.5 rounded border border-red-200/60 dark:border-red-900/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">
                        {item.drugs[0]} + {item.drugs[1]}
                      </span>
                      <Badge variant="destructive" className="uppercase text-[10px]">
                        {item.severity} Risk
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                    <p className="text-red-600 dark:text-red-400 font-medium">⚠️ {item.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
                <ShieldCheck className="size-4 shrink-0" />
                No high-risk contraindications detected between these medications in the reference database.
              </div>
            )}

            {/* AI Clinical Pharmacological Analysis */}
            {result.pharmacologicalAnalysis && (
              <div className="p-3 rounded-lg border bg-muted/40 text-xs space-y-1.5 leading-relaxed">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Info className="size-3.5 text-primary" />
                  Pharmacological Overview
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                  <ReactMarkdown>{result.pharmacologicalAnalysis}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
