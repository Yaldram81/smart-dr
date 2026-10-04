'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getDisplayName, URDU_DISEASES, URDU_SYMPTOMS, URDU_CATEGORIES, URDU_SEVERITY } from '@/lib/urdu-translations'
import { toast } from '@/hooks/use-toast'
import ReactMarkdown from 'react-markdown'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

// Icons
import {
  Stethoscope, ArrowLeft, Activity, AlertTriangle, Star, UserCheck,
  ClipboardList, Info, CheckCircle2, Shield, Pill, Apple,
  Syringe, Brain, Copy, Printer, FileText, Download, TrendingUp,
  Dumbbell, Calendar, Clock, User, HeartPulse, Sparkles, Check,
  ChevronDown, ChevronRight, Languages, AlertCircle, PhoneCall,
  ExternalLink, BookmarkPlus, Share2, RotateCcw, ShieldAlert
} from 'lucide-react'

// Sub-components
import { SeverityBadge } from '@/components/prediction-results/severity-badge'
import { ConfidenceBar } from '@/components/prediction-results/confidence-bar'

export default function PredictionResultsTab() {
  const router = useRouter()
  const { predictions, llmAnalysis, clearSelectedSymptoms, language, setLanguage, user } = useAppStore()
  const [activeProtocolTab, setActiveProtocolTab] = useState<'precautions' | 'medications' | 'diet' | 'workout'>('precautions')
  const [copied, setCopied] = useState(false)

  // Empty state if no predictions have been run
  if (predictions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="size-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 text-primary">
          <Stethoscope className="size-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">No Active Medical Evaluation</h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto mb-8">
          Please select your active symptoms on the Symptom Checker to generate an AI-powered diagnostic prediction and care report.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground gap-2.5 rounded-xl shadow-md hover:shadow-lg transition-all">
          <Link href="/checker">
            <Stethoscope className="size-5" />
            Launch Symptom Checker
          </Link>
        </Button>
      </div>
    )
  }

  const topPrediction = predictions[0]
  const otherPredictions = predictions.slice(1)
  const isSevere = topPrediction.severity.toLowerCase() === 'severe'
  const isModerate = topPrediction.severity.toLowerCase() === 'moderate'

  // Severity theme styling
  const severityTheme = {
    severe: {
      badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      heroBorder: 'border-rose-500/30 dark:border-rose-500/20',
      gradient: 'from-rose-500/10 via-background to-background',
      progressColor: 'text-rose-500',
      triageTitle: 'High Clinical Priority — Urgent Care Advised',
      triageDesc: 'Your symptom profile indicates an acute or serious medical condition. Prompt consultation with a specialist is strongly recommended.',
      triageIcon: <ShieldAlert className="size-5 text-rose-500 shrink-0" />,
      urgency: 'Immediate / Within 12-24 Hours',
    },
    moderate: {
      badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      heroBorder: 'border-amber-500/30 dark:border-amber-500/20',
      gradient: 'from-amber-500/10 via-background to-background',
      progressColor: 'text-amber-500',
      triageTitle: 'Moderate Clinical Priority — Clinical Consultation Advised',
      triageDesc: 'Your symptoms match conditions requiring medical diagnosis and formal treatment. Please schedule an evaluation within 24 to 48 hours.',
      triageIcon: <AlertTriangle className="size-5 text-amber-500 shrink-0" />,
      urgency: 'Within 24-48 Hours',
    },
    mild: {
      badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      heroBorder: 'border-emerald-500/30 dark:border-emerald-500/20',
      gradient: 'from-emerald-500/10 via-background to-background',
      progressColor: 'text-emerald-500',
      triageTitle: 'Routine / Self-Care Priority — Monitor Progression',
      triageDesc: 'Your symptoms suggest a mild, common, or self-limiting condition. Follow conservative care guidelines and consult if symptoms persist over 5-7 days.',
      triageIcon: <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />,
      urgency: 'Routine / Self-Management',
    },
  }[topPrediction.severity.toLowerCase()] || {
    badge: 'bg-primary/15 text-primary border-primary/30',
    heroBorder: 'border-primary/30',
    gradient: 'from-primary/10 via-background to-background',
    progressColor: 'text-primary',
    triageTitle: 'Clinical Evaluation Complete',
    triageDesc: 'Consultation recommendations generated by dual-engine clinical AI.',
    triageIcon: <Info className="size-5 text-primary shrink-0" />,
    urgency: 'Routine Consultation',
  }

  // Generate Reference ID & Date
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const reportTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const caseId = `SDR-${new Date().getFullYear()}-${Math.abs(topPrediction.disease.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase().slice(0, 6)}`

  // Copy structured clinical note to clipboard
  const handleCopyReport = async () => {
    const lines = [
      `========================================`,
      `SMART.DR CLINICAL EVALUATION REPORT`,
      `========================================`,
      `Case Reference: ${caseId}`,
      `Date & Time: ${reportDate} ${reportTime}`,
      `Patient: ${user ? `${user.name} (${user.age ? `${user.age}y, ` : ''}${user.gender || 'Patient'})` : 'Guest Consultation'}`,
      `Triage Level: ${severityTheme.triageTitle}`,
      ``,
      `--- PRIMARY PREDICTION ---`,
      `Condition: ${topPrediction.disease} (${URDU_DISEASES[topPrediction.disease] || ''})`,
      `Confidence: ${topPrediction.confidence}%`,
      `Clinical Severity: ${topPrediction.severity.toUpperCase()}`,
      `Recommended Specialist: ${topPrediction.specialist}`,
      `Matched Symptoms: ${topPrediction.matchedSymptoms.join(', ')}`,
      `Description: ${topPrediction.description}`,
      ``,
      `--- PRECAUTIONS ---`,
      ...topPrediction.precautions.map(p => `• ${p}`),
      ``,
      `--- MEDICATIONS (Rx) ---`,
      ...topPrediction.medications.map(m => `• ${m}`),
      ``,
      `--- NUTRITION & DIET ---`,
      ...topPrediction.diet.map(d => `• ${d}`),
      ``,
      otherPredictions.length > 0 ? `--- DIFFERENTIAL DIAGNOSES ---` : '',
      ...otherPredictions.map((op, idx) => `#${idx + 2} ${op.disease} (${op.confidence}%) - Specialist: ${op.specialist}`),
      ``,
      `⚠️ DISCLAIMER: AI evaluation for clinical reference only. Always confirm with a qualified healthcare professional.`,
    ].filter(Boolean)

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      toast({ title: 'Report Copied!', description: 'Structured clinical report has been copied to your clipboard.' })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast({ title: 'Export Ready', description: 'Please use the Print / Export button.' })
    }
  }

  // Generate and print styled prescription certificate
  const handlePrintPrescription = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const allMatched = Array.from(new Set(predictions.flatMap(p => p.matchedSymptoms)))

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Smart.Dr — Clinical Consultation & Referral Certificate (${caseId})</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; line-height: 1.5; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f766e; padding-bottom: 14px; margin-bottom: 20px; }
    .logo-box h1 { margin: 0; font-size: 24px; color: #0f766e; letter-spacing: -0.5px; }
    .logo-box p { margin: 2px 0 0 0; color: #64748b; font-size: 11px; }
    .meta-box { text-align: right; font-size: 11px; color: #475569; }
    .meta-box strong { color: #0f172a; }
    .patient-strip { display: grid; grid-template-columns: repeat(4, 1fr); background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; }
    .patient-strip div span { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .patient-strip div strong { color: #0f172a; }
    .triage-alert { background: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #e11d48; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #9f1239; }
    .diagnosis-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 20px; background: #fafafa; }
    .diagnosis-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
    .diagnosis-title h2 { margin: 0; font-size: 20px; color: #0f766e; }
    .confidence-badge { background: #0f766e; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #fff; }
    .box-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #0f766e; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
    ul { margin: 0; padding-left: 18px; font-size: 12px; color: #334155; }
    li { margin-bottom: 4px; }
    .rx-symbol { font-size: 24px; font-weight: 800; color: #0f766e; margin-bottom: 4px; }
    .disclaimer { font-size: 10px; color: #64748b; background: #fefce8; border: 1px solid #fef08a; padding: 10px; border-radius: 6px; margin-top: 24px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; }
    .signature-line { border-top: 1px solid #94a3b8; width: 180px; text-align: center; padding-top: 4px; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-box">
      <h1>Smart.Dr Health Intelligence</h1>
      <p>Dual-Engine Clinical Diagnostic System • AI Prediction & Referral</p>
    </div>
    <div class="meta-box">
      <div>Case Ref: <strong>${caseId}</strong></div>
      <div>Date: <strong>${reportDate}</strong></div>
      <div>Time: <strong>${reportTime}</strong></div>
    </div>
  </div>

  <div class="patient-strip">
    <div><span>Patient</span><strong>${user ? user.name : 'Guest Patient'}</strong></div>
    <div><span>Age / Gender</span><strong>${user ? `${user.age || '—'} / ${user.gender || '—'}` : '—'}</strong></div>
    <div><span>Blood Group</span><strong>${user?.bloodGroup || '—'}</strong></div>
    <div><span>Triage Status</span><strong>${topPrediction.severity.toUpperCase()}</strong></div>
  </div>

  <div class="triage-alert">
    <strong>Clinical Priority Notice:</strong> ${severityTheme.triageTitle}. Urgency recommendation: <strong>${severityTheme.urgency}</strong>.
  </div>

  <div class="diagnosis-card">
    <div class="diagnosis-title">
      <div>
        <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold;">Primary Diagnostic Finding</span>
        <h2>${topPrediction.disease} ${URDU_DISEASES[topPrediction.disease] ? `(${URDU_DISEASES[topPrediction.disease]})` : ''}</h2>
      </div>
      <span class="confidence-badge">${topPrediction.confidence}% Match Certainty</span>
    </div>
    <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">${topPrediction.description}</p>
    <div style="font-size: 11px; color: #334155;">
      <strong>Consultation Specialist:</strong> ${topPrediction.specialist} &nbsp;|&nbsp;
      <strong>Hallmark Symptoms Matched:</strong> ${topPrediction.matchedSymptoms.join(', ')}
    </div>
  </div>

  <div class="grid-2">
    <div class="box">
      <div class="box-title">Clinical Safeguards & Precautions</div>
      <ul>
        ${topPrediction.precautions.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
    <div class="box">
      <div class="rx-symbol">℞</div>
      <div class="box-title">Prescribed Pharmacotherapy</div>
      <ul>
        ${topPrediction.medications.map(m => `<li>${m}</li>`).join('')}
      </ul>
      <p style="font-size: 10px; color: #94a3b8; margin: 8px 0 0 0;">*Dosage and administration must be confirmed by a licensed medical practitioner.</p>
    </div>
  </div>

  <div class="grid-2">
    <div class="box">
      <div class="box-title">Therapeutic Nutrition (Diet)</div>
      <ul>
        ${topPrediction.diet.map(d => `<li>${d}</li>`).join('')}
      </ul>
    </div>
    <div class="box">
      <div class="box-title">Physical Rehabilitation & Activity</div>
      <ul>
        ${(topPrediction.workout && topPrediction.workout.length > 0 ? topPrediction.workout : ['Adequate restorative bed rest', 'Gentle hydration pacing', 'Avoid heavy physical exertion']).map(w => `<li>${w}</li>`).join('')}
      </ul>
    </div>
  </div>

  ${otherPredictions.length > 0 ? `
  <div class="box" style="margin-bottom: 20px;">
    <div class="box-title">Differential Diagnoses Considered</div>
    <div style="font-size: 11px; color: #475569;">
      ${otherPredictions.map((op, idx) => `<div><strong>#${idx + 2} ${op.disease}:</strong> ${op.confidence}% probability &bull; Consult: ${op.specialist} &bull; Matched: ${op.matchedSymptoms.join(', ')}</div>`).join('')}
    </div>
  </div>
  ` : ''}

  <div class="disclaimer">
    <strong>LEGAL MEDICAL NOTICE:</strong> This diagnostic document is computer-generated by Smart.Dr clinical intelligence software for informational and preliminary triage use. It is not an official medical license prescription and does not substitute for an in-person physical clinical examination. Consult a licensed medical practitioner immediately.
  </div>

  <div class="footer">
    <div>Smart.Dr Automated Clinical Referral System &bull; Secure Health Engine</div>
    <div class="signature-line">Attending / Reviewing Physician</div>
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background pb-16">
      {/* 1. TOP CLINICAL HEADER BAR */}
      <div className="border-b bg-card/80 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-4 md:px-6 py-3 max-w-[1500px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Left: Navigation & Case Meta */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1.5 text-xs h-9 hover:bg-muted font-medium"
              >
                <Link href="/checker">
                  <ArrowLeft className="size-4" />
                  <span>Back to Checker</span>
                </Link>
              </Button>
              <div className="w-[1px] h-5 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[11px] h-6 px-2 text-muted-foreground border-border/80">
                  {caseId}
                </Badge>
                <span className="text-xs text-muted-foreground hidden md:inline">
                  {reportDate} • {reportTime}
                </span>
                {user ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs h-6 px-2 font-medium">
                    <User className="size-3 mr-1" />
                    {user.name}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[11px] h-6 px-2 font-normal text-muted-foreground">
                    Guest Evaluation
                  </Badge>
                )}
              </div>
            </div>

            {/* Right: Language Selector & Quick Export Actions */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              {/* Language Switcher */}
              <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 gap-0.5">
                <div className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-muted-foreground font-medium">
                  <Languages className="size-3 text-primary" />
                </div>
                {(['en', 'ur', 'both'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLanguage(l)}
                    className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                      language === l
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                    } ${l === 'ur' ? 'font-urdu' : ''}`}
                  >
                    {l === 'en' ? 'English' : l === 'ur' ? 'اردو' : 'Both'}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReport}
                className="h-8 text-xs gap-1.5 font-medium"
                title="Copy structured report"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={handlePrintPrescription}
                className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground font-semibold shadow-xs"
              >
                <Printer className="size-3.5" />
                <span>Export Prescription</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-[1500px] space-y-6">
        {/* 2. DYNAMIC CLINICAL TRIAGE ALERT BANNER */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isSevere
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
              : isModerate
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isSevere ? 'bg-rose-500 text-white' : isModerate ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {severityTheme.triageIcon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base leading-tight">
                  {severityTheme.triageTitle}
                </h4>
                <Badge variant="outline" className={`text-[11px] font-semibold uppercase ${severityTheme.badge}`}>
                  {topPrediction.severity} Severity
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                {severityTheme.triageDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <div className="text-right hidden md:block">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Recommended Action</span>
              <span className="text-xs font-semibold text-foreground">{severityTheme.urgency}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintPrescription}
              className="text-xs h-8 bg-background/80 hover:bg-background"
            >
              Prescription PDF
            </Button>
          </div>
        </motion.div>

        {/* 3. HERO DIAGNOSTIC COMMAND CENTER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className={`relative overflow-hidden border-2 ${severityTheme.heroBorder} bg-card shadow-lg`}>
            {/* Top decorative gradient bar */}
            <div className={`h-2 bg-gradient-to-r ${
              isSevere
                ? 'from-rose-500 via-amber-500 to-rose-600'
                : isModerate
                ? 'from-amber-500 via-primary to-amber-600'
                : 'from-emerald-500 via-teal-400 to-primary'
            }`} />

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left 8 Cols: Primary Diagnosis Title, Meta & Description */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Status Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-primary text-primary-foreground font-semibold text-xs px-2.5 py-0.5 gap-1.5 shadow-xs">
                      <Star className="size-3.5 fill-current" />
                      Primary Diagnosis (#1 Probability)
                    </Badge>
                    <SeverityBadge severity={topPrediction.severity} large />
                    <Badge variant="outline" className="text-xs font-medium border-border/80 text-muted-foreground gap-1.5">
                      <UserCheck className="size-3.5 text-primary" />
                      Consult: <strong>{topPrediction.specialist}</strong>
                    </Badge>
                  </div>

                  {/* Disease Title (English & Nastaleeq Urdu) */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                      {language === 'ur' ? (URDU_DISEASES[topPrediction.disease] || topPrediction.disease) : topPrediction.disease}
                    </h1>
                    {(language === 'both' || language === 'en') && URDU_DISEASES[topPrediction.disease] && (
                      <p className="text-xl sm:text-2xl text-primary font-urdu mt-1 font-semibold opacity-90" dir="rtl">
                        {URDU_DISEASES[topPrediction.disease]}
                      </p>
                    )}
                  </div>

                  {/* Medical Description */}
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
                    {topPrediction.description}
                  </p>

                  {/* Matched Hallmark Symptoms Pills */}
                  <div className="pt-2 space-y-2.5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        Contributing Diagnostic Indicators ({topPrediction.matchedSymptoms.length} Matched):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {topPrediction.matchedSymptoms.map((sym) => {
                          const urduSym = URDU_SYMPTOMS[sym]
                          const contrib = topPrediction.contributingSymptoms?.find(c => c.name.toLowerCase() === sym.toLowerCase())
                          const isHallmark = contrib?.importance === 'HALLMARK'

                          return (
                            <Badge
                              key={sym}
                              variant="secondary"
                              className={`text-xs py-1 px-2.5 gap-1.5 transition-colors border ${
                                isHallmark
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-semibold'
                                  : 'bg-primary/10 text-foreground border-primary/20'
                              }`}
                            >
                              <CheckCircle2 className={`size-3 ${isHallmark ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'}`} />
                              <span>{language === 'ur' ? (urduSym || sym) : sym}</span>
                              {isHallmark && (
                                <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                                  Hallmark
                                </span>
                              )}
                              {language === 'both' && urduSym && (
                                <span className="text-[11px] opacity-75 font-urdu">({urduSym})</span>
                              )}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>

                    {/* Absent Hallmark Symptoms (Clinical Negative Evidence) */}
                    {topPrediction.absentHallmarks && topPrediction.absentHallmarks.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
                        <span className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider block mb-1">
                          Expected Hallmark Symptoms Not Reported ({topPrediction.absentHallmarks.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {topPrediction.absentHallmarks.map((abs) => {
                            const urduAbs = URDU_SYMPTOMS[abs.name]
                            return (
                              <Badge
                                key={abs.name}
                                variant="outline"
                                className="text-[11px] py-0.5 px-2 text-muted-foreground border-dashed border-muted-foreground/30"
                              >
                                <span>{language === 'ur' ? (urduAbs || abs.name) : abs.name}</span>
                                <span className="text-[9px] opacity-60 ml-1">(Absent)</span>
                              </Badge>
                            )
                          })}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          *The absence of these cardinal indicators distinguishes this finding as a pattern similarity rather than a definitive diagnosis.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 4 Cols: Radial Similarity Dial / Pattern Score Card */}
                <div className="lg:col-span-4 bg-muted/30 border border-border/60 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Symptom Pattern Similarity
                  </span>

                  {/* Radial / Progress Circle Visual */}
                  <div className="relative size-36 flex items-center justify-center">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="stroke-muted"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={
                          topPrediction.confidence >= 75
                            ? 'stroke-emerald-500'
                            : topPrediction.confidence >= 50
                            ? 'stroke-primary'
                            : 'stroke-amber-500'
                        }
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        strokeDasharray={251.2}
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * topPrediction.confidence) / 100 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-mono tracking-tight text-foreground">
                        {topPrediction.confidence}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Confidence
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 w-full">
                    <Badge variant="outline" className={`w-full justify-center text-xs py-1 font-semibold ${
                      topPrediction.confidence >= 75
                        ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                        : 'border-primary/30 text-primary bg-primary/10'
                    }`}>
                      {topPrediction.confidence >= 75 ? 'High Pattern Alignment' : 'Moderate Pattern Overlap'}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Weighted similarity index based on symptom profile correlation (Smart.Dr Engine v2.1). Not a medical certainty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 4. TWO-COLUMN WORKSTATION LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* COLUMN 1: LEFT / MAIN WORKBENCH (PROTOCOL & DIFFERENTIALS) */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* CARD A: COMPREHENSIVE CLINICAL CARE PROTOCOL */}
            <Card className="border border-border/70 shadow-sm bg-card overflow-hidden">
              <CardHeader className="p-4 sm:p-5 border-b bg-muted/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <ClipboardList className="size-5 text-primary" />
                      <span>Recommended Clinical Care Protocol</span>
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      Standard medical management plan for {topPrediction.disease}
                    </CardDescription>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/50 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveProtocolTab('precautions')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        activeProtocolTab === 'precautions'
                          ? 'bg-background text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Shield className="size-3.5" />
                      <span>Safeguards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveProtocolTab('medications')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        activeProtocolTab === 'medications'
                          ? 'bg-background text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Pill className="size-3.5" />
                      <span>Medications</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveProtocolTab('diet')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        activeProtocolTab === 'diet'
                          ? 'bg-background text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Apple className="size-3.5" />
                      <span>Diet</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveProtocolTab('workout')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                        activeProtocolTab === 'workout'
                          ? 'bg-background text-primary shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Dumbbell className="size-3.5" />
                      <span>Recovery</span>
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                {/* TAB 1: PRECAUTIONS & RED FLAGS */}
                {activeProtocolTab === 'precautions' && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Shield className="size-4 text-primary" />
                        Clinical Precautions & Preventive Measures
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {topPrediction.precautions.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-2.5 text-xs text-foreground"
                          >
                            <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="leading-relaxed font-medium">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Red Flag Warning Signs Box */}
                    <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertCircle className="size-4 text-rose-500" />
                        <span>🚨 Red Flag Warning Signs — When to Seek Emergency Care</span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">
                        If you experience difficulty breathing, blue lips/fingertips, severe chest pressure, sudden confusion, or high fever unresponsive to medication, proceed directly to the nearest hospital emergency room or dial emergency services (1122).
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: PHARMACOTHERAPY (MEDICATIONS - EDUCATIONAL REFERENCE) */}
                {activeProtocolTab === 'medications' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Pill className="size-4 text-primary" />
                        Commonly Considered Pharmacotherapy (Educational Reference)
                      </h4>
                      <Badge variant="outline" className="text-[11px] text-amber-600 dark:text-amber-400 border-amber-500/30">
                        Physician Confirmation Required
                      </Badge>
                    </div>

                    {topPrediction.treatmentOverview && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground">
                        <strong className="text-foreground block mb-0.5">Clinical Management Synopsis:</strong>
                        <span>{topPrediction.treatmentOverview}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {topPrediction.medications.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-border/60 bg-muted/15 flex items-start gap-3"
                        >
                          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Syringe className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-xs sm:text-sm text-foreground">{med}</h5>
                            <span className="text-[11px] text-muted-foreground block mt-0.5">
                              Therapeutic pharmaceutical agent for symptom mitigation
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-[11px] text-muted-foreground flex items-center gap-2">
                      <Info className="size-4 shrink-0 text-primary" />
                      <span>Medication names are displayed for educational and clinical consultation purposes. Do not self-administer prescription drugs without medical oversight.</span>
                    </div>
                  </div>
                )}

                {/* TAB 3: DIET & NUTRITION */}
                {activeProtocolTab === 'diet' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Apple className="size-4 text-primary" />
                      Therapeutic Dietary Recommendations
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {topPrediction.diet.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-2.5 text-xs text-foreground"
                        >
                          <Check className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="leading-relaxed font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-[11px] text-muted-foreground">
                      <strong>Nutritional Advice:</strong> Maintain adequate hydration with electrolytes and water. Consume nutrient-dense, easily digestible whole foods during recovery.
                    </div>
                  </div>
                )}

                {/* TAB 4: RECOVERY & REHABILITATION */}
                {activeProtocolTab === 'workout' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Dumbbell className="size-4 text-primary" />
                      Physical Activity & Rest Protocol
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(topPrediction.workout && topPrediction.workout.length > 0
                        ? topPrediction.workout
                        : ['Restorative bed rest during acute phase', 'Gentle walking when tolerated', 'Deep breathing exercises', 'Avoid strenuous heavy exertion']
                      ).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-start gap-2.5 text-xs text-foreground"
                        >
                          <Activity className="size-4 text-primary mt-0.5 shrink-0" />
                          <span className="leading-relaxed font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-[11px] text-muted-foreground">
                      <strong>Pacing Guideline:</strong> Listen to your body and avoid physical exhaustion. Rest is essential for immune defense and tissue restoration.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CARD B: DIFFERENTIAL DIAGNOSES (ALTERNATIVE POSSIBILITIES) */}
            {otherPredictions.length > 0 && (
              <Card className="border border-border/70 shadow-sm bg-card overflow-hidden">
                <CardHeader className="p-4 sm:p-5 border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        <span>Differential Diagnoses ({otherPredictions.length} Secondary Possibilities)</span>
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Alternative conditions evaluated by clinical algorithm based on overlapping symptoms
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 space-y-3">
                  <Accordion type="single" collapsible className="space-y-2.5">
                    {otherPredictions.map((pred, idx) => {
                      const urduName = URDU_DISEASES[pred.disease]
                      return (
                        <AccordionItem
                          key={pred.disease}
                          value={pred.disease}
                          className="border border-border/60 rounded-xl px-4 py-1 bg-card hover:bg-muted/10 transition-colors shadow-2xs"
                        >
                          <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center justify-between gap-4 w-full pr-2 text-left">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="size-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                  #{idx + 2}
                                </span>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-sm text-foreground">
                                      {language === 'ur' ? (urduName || pred.disease) : pred.disease}
                                    </h4>
                                    {language === 'both' && urduName && (
                                      <span className="text-xs text-primary font-urdu" dir="rtl">
                                        ({urduName})
                                      </span>
                                    )}
                                    <SeverityBadge severity={pred.severity} />
                                  </div>
                                  <span className="text-[11px] text-muted-foreground block truncate">
                                    Specialist: {pred.specialist} • {pred.matchedSymptoms.length} symptoms matched
                                  </span>
                                </div>
                              </div>

                              <div className="w-28 sm:w-36 shrink-0">
                                <ConfidenceBar confidence={pred.confidence} size="sm" />
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 text-xs space-y-3 border-t border-border/40">
                            <p className="text-muted-foreground leading-relaxed">
                              {pred.description}
                            </p>

                            <div className="space-y-1.5">
                              <span className="font-semibold text-foreground text-[11px] block">
                                Matched Symptoms for this condition:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {pred.matchedSymptoms.map((s) => (
                                  <Badge key={s} variant="secondary" className="text-[10px] py-0.5 px-2">
                                    {getDisplayName(s, URDU_SYMPTOMS[s] || s, language)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                                <strong className="text-[11px] text-foreground block mb-1">Key Precautions:</strong>
                                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                  {pred.precautions.slice(0, 3).map((p, i) => (
                                    <li key={i}>{p}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                                <strong className="text-[11px] text-foreground block mb-1">Recommended Medications:</strong>
                                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                  {pred.medications.slice(0, 3).map((m, i) => (
                                    <li key={i}>{m}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2: RIGHT SIDEBAR (SPECIALIST, AI NARRATIVE & CTAS) */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            {/* CARD 1: SPECIALIST REFERRAL & QUESTIONS FOR DOCTOR */}
            <Card className="border border-border/70 shadow-sm bg-card overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <UserCheck className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">
                      Specialist Referral
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Medical department recommendation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Recommended Consultation
                  </span>
                  <h4 className="text-base font-bold text-primary">
                    {topPrediction.specialist}
                  </h4>
                  <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5 text-primary" />
                    <span>Timeline: <strong>{severityTheme.urgency}</strong></span>
                  </div>
                </div>

                {/* 3 Smart Questions to Ask Doctor */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Questions to ask your physician:
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg border bg-muted/20 text-muted-foreground flex items-start gap-2">
                      <span className="font-bold text-primary">1.</span>
                      <span>Are confirmatory diagnostic blood or imaging tests (e.g. CBC, X-ray) necessary?</span>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-muted/20 text-muted-foreground flex items-start gap-2">
                      <span className="font-bold text-primary">2.</span>
                      <span>What early warning symptoms indicate that my condition is worsening?</span>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-muted/20 text-muted-foreground flex items-start gap-2">
                      <span className="font-bold text-primary">3.</span>
                      <span>How long should I expect recovery to take before returning to regular activity?</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CARD 2: AI CLINICAL NARRATIVE (GEMINI / DUAL ENGINE) */}
            <Card className="border border-border/70 shadow-sm bg-card overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <Brain className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider">
                        AI Health Synthesis
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Dual-engine medical intelligence
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30">
                    Clinical AI
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5">
                {llmAnalysis ? (
                  <div className="prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed space-y-2">
                    <ReactMarkdown>{llmAnalysis}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    <p>
                      The clinical algorithm evaluated your symptom profile against recognized disease diagnostic criteria. The concurrence of <strong>{topPrediction.matchedSymptoms.join(', ')}</strong> strongly aligns with <strong>{topPrediction.disease}</strong>.
                    </p>
                    <p>
                      Secondary potential matches have also been computed and placed in the differential diagnoses section. Please review with a medical professional.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CARD 3: CONSULTATION ACTIONS & RE-CHECK */}
            <Card className="border border-border/70 shadow-sm bg-card p-4 space-y-2.5">
              <Button
                onClick={handlePrintPrescription}
                className="w-full bg-primary text-primary-foreground font-semibold h-10 gap-2 shadow-xs"
              >
                <Printer className="size-4" />
                <span>Export Official Prescription</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleCopyReport}
                className="w-full text-xs h-9 gap-2 font-medium"
              >
                {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Report Copied to Clipboard' : 'Copy Clinical Summary'}</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  clearSelectedSymptoms()
                  router.push('/checker')
                }}
                className="w-full text-xs h-9 gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                <span>Start New Symptom Evaluation</span>
              </Button>
            </Card>

            {/* DISCLAIMER NOTICE */}
            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/30 text-[11px] text-muted-foreground leading-relaxed space-y-1">
              <strong className="text-foreground block">Medical Verification Disclaimer:</strong>
              <span>
                Smart.Dr predictions are calculated for clinical triage and personal educational guidance only. They do not constitute formal medical diagnosis or replace consultation with a board-certified physician.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
