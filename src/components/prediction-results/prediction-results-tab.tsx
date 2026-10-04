'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getDisplayName, URDU_DISEASES, URDU_SYMPTOMS } from '@/lib/urdu-translations'
import { toast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

// Icons
import {
  Stethoscope, ArrowLeft, Activity, AlertTriangle, Star, UserCheck,
  ClipboardList, Info, CheckCircle2, Shield, Pill, Apple,
  Syringe, Brain, Copy, Printer, FileText, Download, TrendingUp,
  Dumbbell
} from 'lucide-react'

// Sub-components
import { SeverityBadge } from '@/components/prediction-results/severity-badge'
import { ConfidenceBar } from '@/components/prediction-results/confidence-bar'

function PredictionResultsTab() {
  const router = useRouter()
  const { predictions, llmAnalysis, clearSelectedSymptoms, language, user } = useAppStore()

  if (predictions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <Stethoscope className="size-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Predictions Yet</h2>
        <p className="text-muted-foreground mb-6">Select your symptoms and run a prediction first.</p>
        <Button asChild className="bg-primary text-primary-foreground gap-2">
          <Link href="/checker">
            <Stethoscope className="size-4" />
            Go to Symptom Checker
          </Link>
        </Button>
      </div>
    )
  }

  const topPrediction = predictions[0]

  const severityBorder: Record<string, string> = {
    mild: 'border-l-emerald-500',
    moderate: 'border-l-amber-500',
    severe: 'border-l-red-500',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4 gap-1">
          <Link href="/checker">
            <ArrowLeft className="size-4" />
            Back to Symptom Checker
          </Link>
        </Button>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Activity className="size-8 text-primary" />
          Prediction Results
        </h2>
        <p className="text-muted-foreground mt-2">Based on your selected symptoms, here are the AI-analyzed predictions</p>
      </div>

      {/* Disclaimer Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-3 items-start">
          <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-amber-800 dark:text-amber-400">AI-Generated Results — For Information Only</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              These predictions should not replace professional medical advice. Always consult a qualified healthcare provider.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`mb-8 shadow-md border-l-4 ${severityBorder[topPrediction.severity.toLowerCase()] || 'border-l-amber-500'}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <Badge variant="default" className="mb-2 gap-1">
                  <Star className="size-3" />
                  Top Prediction
                </Badge>
                <CardTitle className="text-2xl md:text-3xl">{getDisplayName(topPrediction.disease, URDU_DISEASES[topPrediction.disease] || topPrediction.disease, language)}</CardTitle>
              </div>
              <SeverityBadge severity={topPrediction.severity} large />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-1 block">Confidence Level</Label>
              <div className="relative">
                <ConfidenceBar confidence={topPrediction.confidence} animate />
                {/* Animated pulse ring around top prediction */}
                <motion.div
                  className="absolute -top-1 -bottom-1 -left-1 -right-1 rounded-full pointer-events-none"
                  animate={{ boxShadow: ['0 0 0 0 oklch(0.55 0.17 160 / 0)', '0 0 0 4px oklch(0.55 0.17 160 / 0.15)', '0 0 0 0 oklch(0.55 0.17 160 / 0)'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed">{topPrediction.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <UserCheck className="size-3" />
                {topPrediction.specialist}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <ClipboardList className="size-3" />
                {topPrediction.matchedSymptoms.length} symptoms matched
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Predictions */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="size-5" />
          All Predictions
        </h3>
        {predictions.map((pred, i) => (
          <motion.div
            key={pred.disease}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all border-l-4 border-l-primary/20">
              <Accordion type="single" collapsible>
                <AccordionItem value={pred.disease} className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-4 w-full text-left">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{getDisplayName(pred.disease, URDU_DISEASES[pred.disease] || pred.disease, language)}</span>
                          <SeverityBadge severity={pred.severity} />
                        </div>
                        <div className="mt-1">
                          <ConfidenceBar confidence={pred.confidence} animate />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="font-medium text-sm flex items-center gap-1.5 mb-1">
                          <Info className="size-4 text-primary" /> Description
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{pred.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="size-4 text-primary" /> Matched Symptoms
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pred.matchedSymptoms.map((sym) => (
                            <Badge key={sym} variant="secondary" className="text-xs">{getDisplayName(sym, URDU_SYMPTOMS[sym] || sym, language)}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                            <Shield className="size-4 text-primary" /> Precautions
                          </h4>
                          <ul className="space-y-1">
                            {pred.precautions.map((p, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-1.5">
                                <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                            <Pill className="size-4 text-primary" /> Medications
                          </h4>
                          <ul className="space-y-1">
                            {pred.medications.map((m, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-start gap-1.5">
                                <Syringe className="size-3.5 text-teal-500 mt-0.5 shrink-0" />
                                {m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {pred.diet.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                            <Apple className="size-4 text-primary" /> Diet Recommendations
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {pred.diet.map((d, j) => (
                              <Badge key={j} variant="outline" className="text-xs">{d}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {pred.workout && pred.workout.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm flex items-center gap-1.5 mb-2">
                            <Dumbbell className="size-4 text-primary" /> Workout Recommendations
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {pred.workout.map((w, j) => (
                              <Badge key={j} variant="outline" className="text-xs gap-1">
                                <Dumbbell className="size-3" />
                                {w}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <UserCheck className="size-4 text-primary" />
                        <span className="text-sm">
                          <strong>Consult:</strong> {pred.specialist}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* LLM Analysis */}
      {llmAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mb-8 border-teal-500/20 shadow-md overflow-hidden">
            {/* Gradient header bar */}
            <div className="h-1.5 bg-gradient-to-r from-teal-500 via-primary to-teal-500 animate-[gradient-x_3s_ease_infinite] bg-[length:200%_100%]" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Brain className="size-5" />
                </div>
                <div>
                  AI Health Analysis
                  <CardDescription className="text-xs mt-0.5">Detailed AI-generated analysis of your symptoms and predictions</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-xl p-4 border">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{llmAnalysis}</ReactMarkdown>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <Card className="mb-8 border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10">
        <CardContent className="p-4 flex gap-3">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-amber-800 dark:text-amber-400">Medical Disclaimer</p>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              This tool is for educational purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => {
            clearSelectedSymptoms()
            router.push('/checker')
          }}
          className="bg-primary text-primary-foreground gap-2"
        >
          <Stethoscope className="size-4" />
          Check Again
        </Button>
        {user && (
          <Button variant="outline" asChild className="gap-2">
            <Link href="/dashboard">
              <TrendingUp className="size-4" />
              View Dashboard
            </Link>
          </Button>
        )}
        <Button
          variant="outline"
          className="gap-2"
          onClick={async () => {
            const lines: string[] = []
            lines.push('=== Smart.Dr - Prediction Report ===')
            lines.push(`Date: ${new Date().toLocaleDateString()}`)
            lines.push('')
            lines.push('--- TOP PREDICTION ---')
            lines.push(`Disease: ${topPrediction.disease}`)
            lines.push(`Confidence: ${topPrediction.confidence}%`)
            lines.push(`Severity: ${topPrediction.severity}`)
            lines.push(`Specialist: ${topPrediction.specialist}`)
            lines.push(`Description: ${topPrediction.description}`)
            lines.push('')
            lines.push('--- ALL PREDICTIONS ---')
            predictions.forEach((pred, i) => {
              lines.push(`\n${i + 1}. ${pred.disease} (${pred.confidence}% confidence)`)
              lines.push(`   Severity: ${pred.severity} | Specialist: ${pred.specialist}`)
              lines.push(`   Description: ${pred.description}`)
              if (pred.precautions.length > 0) lines.push(`   Precautions: ${pred.precautions.join(', ')}`)
              if (pred.medications.length > 0) lines.push(`   Medications: ${pred.medications.join(', ')}`)
              if (pred.diet.length > 0) lines.push(`   Diet: ${pred.diet.join(', ')}`)
              if (pred.workout && pred.workout.length > 0) lines.push(`   Workout: ${pred.workout.join(', ')}`)
            })
            if (llmAnalysis) {
              lines.push('')
              lines.push('--- AI HEALTH ANALYSIS ---')
              lines.push(llmAnalysis.replace(/[#*_]/g, ''))
            }
            lines.push('')
            lines.push('⚠️ This report is for educational purposes only. Always consult a healthcare professional.')
            const text = lines.join('\n')
            try {
              await navigator.clipboard.writeText(text)
              toast({ title: 'Report Copied!', description: 'Prediction report has been copied to your clipboard.' })
            } catch {
              // Fallback: open print dialog
              const printWindow = window.open('', '_blank')
              if (printWindow) {
                printWindow.document.write(`<pre>${text}</pre>`)
                printWindow.document.close()
                printWindow.print()
              }
            }
          }}
        >
          <Copy className="size-4" />
          Export Report
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Printer className="size-4" />
          Print
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            const { user } = useAppStore.getState()
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            const selectedSymptoms = predictions.flatMap(p => p.matchedSymptoms)
            const uniqueSymptoms = [...new Set(selectedSymptoms)]

            const html = `<!DOCTYPE html>
<html>
<head>
  <title>Smart.Dr - Prescription Sheet</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #059669; margin: 0; font-size: 28px; }
    .header p { color: #666; margin: 4px 0; font-size: 13px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 14px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 10px; }
    .prediction { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .prediction h3 { margin: 0 0 8px 0; color: #166534; }
    .confidence { display: inline-block; background: #059669; color: white; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .severity-mild { background: #10b981; }
    .severity-moderate { background: #f59e0b; }
    .severity-severe { background: #ef4444; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; }
    .info-item { display: flex; align-items: flex-start; gap: 6px; }
    .info-item strong { min-width: 90px; }
    ul { margin: 4px 0; padding-left: 20px; font-size: 13px; }
    li { margin-bottom: 3px; }
    .disclaimer { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-top: 30px; font-size: 12px; }
    .disclaimer strong { color: #92400e; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🩺 Smart.Dr</h1>
    <p>AI-Powered Disease Prediction System</p>
    <p>Dual-Engine Health Analysis Prescription</p>
    <p style="font-weight: 600; margin-top: 10px;">Date: ${date}</p>
    ${user ? `<p>Patient: ${user.name} | Email: ${user.email}</p>` : '<p>Patient: Guest User</p>'}
  </div>

  <div class="section">
    <div class="section-title">Selected Symptoms</div>
    <p>${uniqueSymptoms.join(', ')}</p>
  </div>

  <div class="section">
    <div class="section-title">Prediction Results</div>
    ${predictions.map((pred, i) => `
    <div class="prediction">
      <h3>${i === 0 ? '⭐ ' : ''}${pred.disease}</h3>
      <div style="margin-bottom: 10px;">
        <span class="confidence">Confidence: ${pred.confidence}%</span>
        <span class="confidence severity-${pred.severity.toLowerCase()}">${pred.severity}</span>
      </div>
      <div class="info-grid">
        <div class="info-item"><strong>Specialist:</strong> ${pred.specialist}</div>
        <div class="info-item"><strong>Matched:</strong> ${pred.matchedSymptoms.length} symptoms</div>
      </div>
      <p style="font-size: 13px; margin: 8px 0;">${pred.description}</p>
      ${pred.precautions.length > 0 ? `<p style="font-size: 13px; font-weight: 600; margin-top: 10px;">Precautions:</p><ul>${pred.precautions.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
      ${pred.medications.length > 0 ? `<p style="font-size: 13px; font-weight: 600; margin-top: 8px;">Medications:</p><ul>${pred.medications.map(m => `<li>${m}</li>`).join('')}</ul>` : ''}
      ${pred.diet.length > 0 ? `<p style="font-size: 13px; font-weight: 600; margin-top: 8px;">Diet:</p><ul>${pred.diet.map(d => `<li>${d}</li>`).join('')}</ul>` : ''}
      ${pred.workout && pred.workout.length > 0 ? `<p style="font-size: 13px; font-weight: 600; margin-top: 8px;">Workout:</p><ul>${pred.workout.map(w => `<li>${w}</li>`).join('')}</ul>` : ''}
    </div>
    `).join('')}
  </div>

  ${llmAnalysis ? `
  <div class="section">
    <div class="section-title">AI Health Analysis</div>
    <div style="font-size: 13px; line-height: 1.6;">${llmAnalysis.replace(/[#*_]/g, '').replace(/\n/g, '<br>')}</div>
  </div>
  ` : ''}

  <div class="disclaimer">
    <strong>⚠️ Medical Disclaimer:</strong> This prescription sheet is generated by an AI system (Smart.Dr) for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before starting any treatment, medication, or exercise regimen. If you are experiencing a medical emergency, call your local emergency services immediately.
  </div>

  <div class="footer">
    <p>Smart.Dr — AI-Powered Disease Prediction System</p>
    <p>University of Malakand, Dept of CS & IT</p>
    <p>Generated on ${date}</p>
  </div>
</body>
</html>`
            const printWindow = window.open('', '_blank')
            if (printWindow) {
              printWindow.document.write(html)
              printWindow.document.close()
              setTimeout(() => { printWindow.print() }, 500)
            }
          }}
        >
          <FileText className="size-4" />
          Download Prescription
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            toast({ title: 'Preparing PDF...', description: 'Opening print dialog. Select "Save as PDF" as destination.' })
            const { user } = useAppStore.getState()
            const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            const selectedSymptoms = predictions.flatMap(p => p.matchedSymptoms)
            const uniqueSymptoms = [...new Set(selectedSymptoms)]

            const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Smart.Dr Prescription - ${date}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 25px; color: #1e293b; line-height: 1.5; font-size: 13px; }
    .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { margin: 0 0 4px 0; color: #0284c7; font-size: 24px; font-weight: 800; }
    .header p { margin: 2px 0; color: #64748b; font-size: 12px; }
    .patient-bar { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 18px; font-size: 12px; }
    .section { margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
    .section-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    .tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 9999px; margin: 2px; font-size: 11px; font-weight: 500; }
    .prediction-box { background: #fafafa; border-left: 4px solid #0284c7; padding: 10px; margin-bottom: 10px; border-radius: 0 6px 6px 0; }
    .badge-score { background: #0284c7; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .disclaimer { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 20px; font-size: 11px; color: #92400e; }
    .footer { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>🩺 Smart.Dr Clinical Decision Support</h1>
    <p>AI-Assisted Diagnostic Assessment & Clinical Summary</p>
    <p>University of Malakand | Dept of CS & IT</p>
  </div>

  <div class="patient-bar">
    <div><strong>Patient:</strong> ${user ? user.name : 'Guest Patient'}</div>
    <div><strong>Email:</strong> ${user ? user.email : 'N/A'}</div>
    <div><strong>Date:</strong> ${date}</div>
  </div>

  <div class="section">
    <div class="section-title">Reported Symptoms</div>
    <div>${uniqueSymptoms.map(s => `<span class="tag">${s}</span>`).join('')}</div>
  </div>

  <div class="section">
    <div class="section-title">Differential Diagnoses & Recommendations</div>
    ${predictions.map((p, idx) => `
      <div class="prediction-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="font-size: 14px;">${idx + 1}. ${p.disease}</strong>
          <div>
            <span class="badge-score">Confidence: ${p.confidence}%</span>
            <span style="font-size: 11px; text-transform: uppercase; font-weight: bold; margin-left: 6px;">${p.severity}</span>
          </div>
        </div>
        <p style="margin: 4px 0 6px 0; color: #475569; font-size: 12px;">${p.description}</p>
        <p style="margin: 2px 0;"><strong>Recommended Specialist:</strong> ${p.specialist}</p>
        ${p.precautions.length > 0 ? `<p style="margin: 4px 0 2px 0;"><strong>Key Precautions:</strong> ${p.precautions.join(' • ')}</p>` : ''}
        ${p.medications.length > 0 ? `<p style="margin: 2px 0;"><strong>Medication Guidance:</strong> ${p.medications.join(' • ')}</p>` : ''}
        ${p.diet.length > 0 ? `<p style="margin: 2px 0;"><strong>Dietary Protocol:</strong> ${p.diet.join(' • ')}</p>` : ''}
      </div>
    `).join('')}
  </div>

  ${llmAnalysis ? `
  <div class="section">
    <div class="section-title">AI Clinical Evaluation</div>
    <div style="font-size: 12px; line-height: 1.6; white-space: pre-wrap;">${llmAnalysis.replace(/[#*]/g, '')}</div>
  </div>
  ` : ''}

  <div class="disclaimer">
    <strong>⚠️ Medical Disclaimer:</strong> This document is generated for academic and decision-support purposes only. It is not an official medical diagnosis. Always consult a licensed healthcare practitioner.
  </div>

  <div class="footer">
    Smart.Dr Health Intelligence • Generated on ${date}
  </div>
</body>
</html>`

            const printWindow = window.open('', '_blank')
            if (printWindow) {
              printWindow.document.write(html)
              printWindow.document.close()
              setTimeout(() => { printWindow.print() }, 400)
            }
          }}
        >
          <Download className="size-4" />
          Export PDF
        </Button>
      </div>
    </div>
  )
}

export default PredictionResultsTab
