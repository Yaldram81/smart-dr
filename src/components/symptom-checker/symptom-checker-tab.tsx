'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getDisplayName, URDU_SYMPTOMS, URDU_CATEGORIES } from '@/lib/urdu-translations'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  Stethoscope, Brain, ClipboardList, Zap, Loader2,
  Thermometer, Wind, Droplets, HeartPulse, Shield,
  AlertTriangle, Search, CheckCircle2, X, Sparkles,
  LayoutGrid, List, Layers, SlidersHorizontal, Trash2,
  RotateCcw, Info, ArrowRight, ShieldCheck, Flame, Bone, Eye
} from 'lucide-react'

import { VoiceInputButton } from '@/components/symptom-checker/voice-input-button'
import { SymptomBodyMap, CATEGORY_ICONS, BODY_REGIONS } from '@/components/symptom-checker/symptom-body-map'
import { EmergencyAlert } from '@/components/symptom-checker/emergency-alert'

// Dynamically import 3D Human Anatomy Model for optimal initial load
const SymptomBodyMap3D = dynamic(
  () => import('@/components/symptom-checker/symptom-body-map-3d').then(m => m.SymptomBodyMap3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] w-full rounded-2xl bg-slate-950/60 border border-slate-800 animate-pulse flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="size-7 text-primary animate-spin" />
        <span className="text-xs font-medium">Loading 3D Anatomy Model...</span>
      </div>
    ),
  }
)

type ViewMode = 'grid' | 'compact' | 'categories'

export default function SymptomCheckerTab() {
  const router = useRouter()
  const {
    symptoms, setSymptoms, selectedSymptomIds, toggleSymptom, clearSelectedSymptoms,
    isPredicting, setIsPredicting, setPredictions, setLlmAnalysis,
    user, symptomSearch, setSymptomSearch, isLoadingSymptoms, setIsLoadingSymptoms,
    predictionEngine, setPredictionEngine, language, privacyMode, setPrivacyMode,
  } = useAppStore()

  // Layout & Filtering States
  const [categories, setCategories] = useState<Record<string, { id: string; name: string; description: string | null }[]>>({})
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [bodyRegion, setBodyRegion] = useState<string | null>(null)
  const [selected3DCategories, setSelected3DCategories] = useState<string[] | null>(null)
  const [selected3DLabel, setSelected3DLabel] = useState<string | null>(null)
  const [bodyMapMode, setBodyMapMode] = useState<'3d' | '2d'>('3d')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showAnatomySidebar, setShowAnatomySidebar] = useState<boolean>(true)

  // Fetch all clinical symptoms on mount
  useEffect(() => {
    let isMounted = true
    const fetchSymptoms = async () => {
      setIsLoadingSymptoms(true)
      try {
        const res = await fetch('/api/symptoms')
        const data = await res.json()
        if (isMounted) {
          setSymptoms(data.symptoms || [])
          setCategories(data.categories || {})
        }
      } catch {
        if (isMounted) {
          toast({ title: 'Error', description: 'Failed to load symptoms database', variant: 'destructive' })
        }
      } finally {
        if (isMounted) setIsLoadingSymptoms(false)
      }
    }
    fetchSymptoms()
    return () => { isMounted = false }
  }, [setSymptoms, setIsLoadingSymptoms])

  // Keyboard shortcut: Ctrl + Enter to run prediction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (selectedSymptomIds.length > 0 && !isPredicting) {
          e.preventDefault()
          handlePredict()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSymptomIds, isPredicting])

  // Filter symptoms based on Category Selector, 3D Organ, 2D Body Region, and Search Query
  const filteredCategories = useMemo(() => {
    let cats = categories

    // 1. Organ / 3D selection filter
    if (selected3DCategories && selected3DCategories.length > 0) {
      const filtered: Record<string, { id: string; name: string; description: string | null }[]> = {}
      for (const [cat, syms] of Object.entries(cats)) {
        if (selected3DCategories.includes(cat)) {
          filtered[cat] = syms
        }
      }
      cats = filtered
    } else if (bodyRegion && BODY_REGIONS[bodyRegion]) {
      const regionCategories = BODY_REGIONS[bodyRegion].categories
      const filtered: Record<string, { id: string; name: string; description: string | null }[]> = {}
      for (const [cat, syms] of Object.entries(cats)) {
        if (regionCategories.includes(cat)) {
          filtered[cat] = syms
        }
      }
      cats = filtered
    }

    // 2. Specific Category Filter from sidebar
    if (selectedCategoryFilter !== 'all') {
      const filtered: Record<string, { id: string; name: string; description: string | null }[]> = {}
      if (cats[selectedCategoryFilter]) {
        filtered[selectedCategoryFilter] = cats[selectedCategoryFilter]
      }
      cats = filtered
    }

    // 3. Search query filter (English and Urdu)
    if (!symptomSearch.trim()) return cats
    const search = symptomSearch.toLowerCase()
    const filtered: Record<string, { id: string; name: string; description: string | null }[]> = {}
    for (const [cat, syms] of Object.entries(cats)) {
      const matching = syms.filter(s => {
        const eng = s.name.toLowerCase()
        const urd = (URDU_SYMPTOMS[s.name] || '').toLowerCase()
        return eng.includes(search) || urd.includes(search)
      })
      if (matching.length > 0) filtered[cat] = matching
    }
    return filtered
  }, [categories, symptomSearch, bodyRegion, selected3DCategories, selectedCategoryFilter])

  // Flattened list of visible symptoms for grid view
  const visibleSymptoms = useMemo(() => {
    const list: ({ id: string; name: string; category: string; description: string | null })[] = []
    for (const [cat, syms] of Object.entries(filteredCategories)) {
      for (const s of syms) {
        list.push({ ...s, category: cat })
      }
    }
    return list
  }, [filteredCategories])

  // Selected symptom objects
  const selectedSymptoms = useMemo(
    () => symptoms.filter(s => selectedSymptomIds.includes(s.id)),
    [symptoms, selectedSymptomIds]
  )

  // Count selected symptoms per category
  const selectedCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const sym of selectedSymptoms) {
      counts[sym.category] = (counts[sym.category] || 0) + 1
    }
    return counts
  }, [selectedSymptoms])

  // Diagnostic Readiness Score (0-100%)
  const diagnosticReadiness = useMemo(() => {
    const count = selectedSymptomIds.length
    if (count === 0) return { percent: 0, label: 'No Symptoms Selected', level: 'empty', color: 'bg-muted-foreground' }
    if (count === 1) return { percent: 35, label: 'Preliminary (Add 2+ for high confidence)', level: 'low', color: 'bg-amber-500' }
    if (count === 2) return { percent: 70, label: 'Moderate Confidence (1 more recommended)', level: 'medium', color: 'bg-blue-500' }
    return { percent: 100, label: 'Clinical Ready (High Accuracy)', level: 'optimal', color: 'bg-emerald-500' }
  }, [selectedSymptomIds.length])

  // Clinical combination presets
  const quickSelectCombinations = useMemo(() => [
    {
      label: language === 'ur' ? 'فلو و بخار' : 'Flu & Fever',
      icon: <Thermometer className="size-3.5 text-rose-500" />,
      symptomNames: ['Fever', 'Cough', 'Fatigue', 'Headache']
    },
    {
      label: language === 'ur' ? 'سانس / دمہ' : 'Respiratory',
      icon: <Wind className="size-3.5 text-cyan-500" />,
      symptomNames: ['Cough', 'Shortness of breath', 'Chest pain', 'Phlegm']
    },
    {
      label: language === 'ur' ? 'معدہ و ہاضمہ' : 'Gastrointestinal',
      icon: <Droplets className="size-3.5 text-amber-500" />,
      symptomNames: ['Nausea', 'Vomiting', 'Abdominal pain', 'Diarrhea', 'Acidity']
    },
    {
      label: language === 'ur' ? 'سر درد و درد شقیقہ' : 'Migraine & Neuro',
      icon: <Brain className="size-3.5 text-purple-500" />,
      symptomNames: ['Headache', 'Dizziness', 'Vision blurred', 'Loss of balance']
    },
    {
      label: language === 'ur' ? 'الرجی و جلدی خارش' : 'Allergy & Skin',
      icon: <Flame className="size-3.5 text-orange-500" />,
      symptomNames: ['Skin rash', 'Itching', 'Sneezing', 'Redness of eyes']
    },
    {
      label: language === 'ur' ? 'دل و نبض' : 'Cardio Concerns',
      icon: <HeartPulse className="size-3.5 text-red-500" />,
      symptomNames: ['Chest pain', 'Irregular heartbeat', 'Shortness of breath', 'Sweating']
    },
  ], [language])

  const handleQuickSelect = (symptomNames: string[]) => {
    let added = 0
    for (const sym of symptoms) {
      if (symptomNames.some(name => sym.name.toLowerCase().includes(name.toLowerCase()))) {
        if (!selectedSymptomIds.includes(sym.id)) {
          toggleSymptom(sym.id)
          added++
        }
      }
    }
    if (added > 0) {
      toast({ title: 'Clinical Preset Applied', description: `Added ${added} symptom${added !== 1 ? 's' : ''} to consultation tray.` })
    }
  }

  const handleClearAnatomyFilter = () => {
    setBodyRegion(null)
    setSelected3DCategories(null)
    setSelected3DLabel(null)
  }

  const handleSelectAllInCategory = (catSymptoms: { id: string }[]) => {
    let added = 0
    for (const s of catSymptoms) {
      if (!selectedSymptomIds.includes(s.id)) {
        toggleSymptom(s.id)
        added++
      }
    }
    if (added > 0) {
      toast({ title: 'Category Selected', description: `Added ${added} symptoms to your checklist.` })
    }
  }

  const handleDeselectAllInCategory = (catSymptoms: { id: string }[]) => {
    for (const s of catSymptoms) {
      if (selectedSymptomIds.includes(s.id)) {
        toggleSymptom(s.id)
      }
    }
  }

  const handlePredict = async () => {
    if (selectedSymptomIds.length === 0) {
      toast({ title: 'No Symptoms Selected', description: 'Please select at least 1 symptom to proceed with diagnostic inference.', variant: 'destructive' })
      return
    }
    setIsPredicting(true)
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptomIds: selectedSymptomIds,
          userId: user?.id,
          patientAge: user?.age,
          patientGender: user?.gender,
          language: language,
          includeLLMAnalysis: predictionEngine === 'online-ai',
          privacyMode: privacyMode,
          engine: predictionEngine,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Prediction Failed', description: data.error || 'Server diagnostic inference failed.', variant: 'destructive' })
        return
      }
      setPredictions(data.predictions || [])
      setLlmAnalysis(data.llmAnalysis || null)
      if (data.predictions.length === 0) {
        toast({ title: 'No matches found', description: 'Try adjusting your symptoms or adding complementary indicators.' })
      } else {
        router.push('/results')
      }
    } catch {
      toast({ title: 'Network Error', description: 'Failed to communicate with diagnostic prediction engine.', variant: 'destructive' })
    } finally {
      setIsPredicting(false)
    }
  }

  if (isLoadingSymptoms) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-[1600px]">
        <div className="space-y-6">
          <Skeleton className="h-10 w-72 rounded-lg" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-muted/10 min-h-[calc(100vh-4rem)]">
      {/* 1. Clinical Workstation Header Strip */}
      <div className="border-b bg-background/80 backdrop-blur-md sticky top-16 z-20 py-3.5">
        <div className="container mx-auto px-4 md:px-6 max-w-[1600px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                <Stethoscope className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight">Symptom Diagnostic Workbench</h1>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-semibold uppercase tracking-wider border-primary/30 text-primary">
                    187+ Symptoms
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Dual-Engine Clinical Inference • Interactive 3D Anatomy Mapping • Real-Time Confidence Scoring
                </p>
              </div>
            </div>

            {/* Quick Actions & View Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Anatomy Toggle */}
              <Button
                variant={showAnatomySidebar ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAnatomySidebar(!showAnatomySidebar)}
                className="gap-1.5 text-xs h-9"
              >
                <Layers className="size-3.5" />
                <span className="hidden sm:inline">Anatomy Explorer</span>
                <span className="sm:hidden">Anatomy</span>
              </Button>

              {/* View Mode Switcher */}
              <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'grid' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('compact')}
                  title="Compact Badges"
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'compact' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <SlidersHorizontal className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('categories')}
                  title="Category Sections"
                  className={`p-1.5 rounded-md text-xs transition-all ${
                    viewMode === 'categories' ? 'bg-background shadow-xs text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>

              {/* Clear All */}
              {selectedSymptomIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelectedSymptoms}
                  className="text-xs text-destructive hover:bg-destructive/10 h-9 gap-1"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Clear</span> ({selectedSymptomIds.length})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-[1600px]">
        {/* Emergency Triage Banner */}
        <div className="mb-6">
          <EmergencyAlert />
        </div>

        {/* 2. Three-Column Clinical Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* COLUMN 1: LEFT SIDEBAR (ANATOMY & CATEGORIES)            */}
          {/* ======================================================== */}
          <div className={`${showAnatomySidebar ? 'lg:col-span-3' : 'hidden'} space-y-5 transition-all`}>
            {/* Card A: Anatomy Explorer (3D / 2D) */}
            <Card className="border-border/60 shadow-sm overflow-hidden bg-card">
              <CardHeader className="p-3.5 pb-2 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-cyan-500 animate-pulse" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">
                      Anatomical Locator
                    </CardTitle>
                  </div>
                  {/* 3D vs 2D Switcher */}
                  <div className="flex items-center rounded-md border bg-muted/60 p-0.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setBodyMapMode('3d')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all ${
                        bodyMapMode === '3d' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      3D
                    </button>
                    <button
                      type="button"
                      onClick={() => setBodyMapMode('2d')}
                      className={`px-2 py-0.5 rounded font-semibold transition-all ${
                        bodyMapMode === '2d' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      2D
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                {/* Active Organ Badge */}
                {(selected3DLabel || (bodyRegion && BODY_REGIONS[bodyRegion])) && (
                  <div className="mb-2 p-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary truncate">
                      Focus: {selected3DLabel || (bodyRegion ? BODY_REGIONS[bodyRegion]?.label : '')}
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAnatomyFilter}
                      className="text-primary hover:text-destructive transition-colors ml-2"
                      title="Clear Anatomy Filter"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* 3D / 2D Model Render */}
                <div className="rounded-xl overflow-hidden border border-border/40 bg-slate-950/40">
                  {bodyMapMode === '3d' ? (
                    <SymptomBodyMap3D
                      activeRegion={bodyRegion}
                      onSelectCategories={(cats, label) => {
                        setSelected3DCategories(cats)
                        setSelected3DLabel(label)
                        setBodyRegion(null)
                        setSelectedCategoryFilter('all')
                      }}
                    />
                  ) : (
                    <div className="p-4 flex flex-col items-center">
                      <SymptomBodyMap
                        activeRegion={bodyRegion}
                        setActiveRegion={(r) => {
                          setBodyRegion(r)
                          setSelected3DCategories(null)
                          setSelected3DLabel(null)
                          setSelectedCategoryFilter('all')
                        }}
                      />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground text-center mt-2.5">
                  Click any organ or region to filter symptoms instantly.
                </p>
              </CardContent>
            </Card>

            {/* Card B: Clinical Category Selector */}
            <Card className="border-border/60 shadow-sm bg-card">
              <CardHeader className="p-3.5 pb-2 border-b bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Clinical Categories
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {Object.keys(categories).length} Total
                </Badge>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="max-h-[300px] pr-2">
                  <div className="space-y-1">
                    {/* All Categories Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryFilter('all')
                        handleClearAnatomyFilter()
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        selectedCategoryFilter === 'all' && !selected3DCategories && !bodyRegion
                          ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="size-3.5" />
                        <span>All Categories</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                        {symptoms.length}
                      </Badge>
                    </button>

                    {/* Category List */}
                    {Object.entries(categories).map(([cat, symList]) => {
                      const isSelected = selectedCategoryFilter === cat
                      const selectedCount = selectedCountByCategory[cat] || 0
                      const Icon = CATEGORY_ICONS[cat] || <ClipboardList className="size-3.5" />

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryFilter(cat)
                            handleClearAnatomyFilter()
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="shrink-0">{Icon}</span>
                            <span className="truncate">{getDisplayName(cat, URDU_CATEGORIES[cat] || cat, language)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {selectedCount > 0 && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                isSelected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                              }`}>
                                {selectedCount}
                              </span>
                            )}
                            <span className="text-[10px] opacity-70">
                              {symList.length}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2: CENTER WORKBENCH (SEARCH, PRESETS & SYMPTOMS)  */}
          {/* ======================================================== */}
          <div className={`${showAnatomySidebar ? 'lg:col-span-6' : 'lg:col-span-9'} space-y-5 min-w-0`}>
            {/* Search Bar & Voice Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'ur' ? 'علامات تلاش کریں (مثلاً: بخار، کھانسی، سر درد)...' : 'Search clinical symptoms (e.g. Chest pain, Fever, Cough)...'}
                  value={symptomSearch}
                  onChange={(e) => setSymptomSearch(e.target.value)}
                  className="pl-10 pr-9 h-11 rounded-xl bg-card border-border/80 shadow-xs text-sm"
                />
                {symptomSearch && (
                  <button
                    type="button"
                    onClick={() => setSymptomSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <VoiceInputButton onResult={setSymptomSearch} />
            </div>

            {/* Clinical Combination Presets Strip */}
            <Card className="border-border/60 bg-card p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Flame className="size-3.5 text-primary" />
                  <span>Clinical Combination Presets</span>
                </div>
                <span className="text-[11px] text-muted-foreground">Click to populate cluster</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {quickSelectCombinations.map(combo => (
                  <button
                    key={combo.label}
                    type="button"
                    onClick={() => handleQuickSelect(combo.symptomNames)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/30 transition-all cursor-pointer shrink-0"
                  >
                    {combo.icon}
                    <span>{combo.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Active Organ Filter Notice */}
            {(selected3DLabel || (bodyRegion && BODY_REGIONS[bodyRegion])) && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <span>
                    Showing symptoms for <strong>{selected3DLabel || (bodyRegion ? BODY_REGIONS[bodyRegion]?.label : '')}</strong>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAnatomyFilter}
                  className="h-7 text-xs text-primary hover:text-destructive hover:bg-transparent"
                >
                  Clear Filter
                </Button>
              </div>
            )}

            {/* Symptoms Counter & Quick Category Pills */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                Displaying <strong>{visibleSymptoms.length}</strong> available symptoms
              </span>
              {selectedCategoryFilter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className="h-6 text-xs text-primary"
                >
                  Reset category filter
                </Button>
              )}
            </div>

            {/* ============================================== */}
            {/* VIEW MODE 1: GRID VIEW (Medical Cards)         */}
            {/* ============================================== */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {visibleSymptoms.map((sym) => {
                  const isSelected = selectedSymptomIds.includes(sym.id)
                  const Icon = CATEGORY_ICONS[sym.category] || <ClipboardList className="size-4" />
                  const urduName = URDU_SYMPTOMS[sym.name]

                  return (
                    <div
                      key={sym.id}
                      onClick={() => toggleSymptom(sym.id)}
                      className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/20 shadow-sm'
                          : 'bg-card border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Header: Category Icon & Checkbox */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`p-1.5 rounded-lg text-xs ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-primary'}`}>
                            {Icon}
                          </span>
                          <div className={`size-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted-foreground/30 bg-background group-hover:border-primary'
                          }`}>
                            {isSelected && <CheckCircle2 className="size-3.5" />}
                          </div>
                        </div>

                        {/* English Symptom Name */}
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {sym.name}
                        </h4>

                        {/* Urdu Translated Name in Nastaleeq */}
                        {urduName && (
                          <p className="text-xs text-muted-foreground font-urdu mt-0.5 opacity-80" dir="rtl">
                            {urduName}
                          </p>
                        )}
                      </div>

                      {/* Footer: Category Badge */}
                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="truncate max-w-[120px]">{sym.category}</span>
                        {isSelected && (
                          <span className="font-semibold text-primary">Selected</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ============================================== */}
            {/* VIEW MODE 2: COMPACT CHIPS VIEW               */}
            {/* ============================================== */}
            {viewMode === 'compact' && (
              <Card className="p-4 border-border/60 bg-card">
                <div className="flex flex-wrap gap-2">
                  {visibleSymptoms.map((sym) => {
                    const isSelected = selectedSymptomIds.includes(sym.id)
                    const urduName = URDU_SYMPTOMS[sym.name]

                    return (
                      <Badge
                        key={sym.id}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => toggleSymptom(sym.id)}
                        className={`cursor-pointer transition-all py-2 px-3 text-xs gap-1.5 ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'hover:bg-primary/10 hover:border-primary/40'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="size-3" />}
                        <span>{sym.name}</span>
                        {urduName && (
                          <span className="opacity-70 font-urdu text-[11px] ml-1">({urduName})</span>
                        )}
                      </Badge>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* ============================================== */}
            {/* VIEW MODE 3: CATEGORIZED SECTIONS VIEW         */}
            {/* ============================================== */}
            {viewMode === 'categories' && (
              <div className="space-y-4">
                {Object.entries(filteredCategories).map(([category, syms]) => {
                  const selectedInCat = selectedCountByCategory[category] || 0
                  const Icon = CATEGORY_ICONS[category] || <ClipboardList className="size-4" />

                  return (
                    <Card key={category} className="border-border/60 bg-card overflow-hidden shadow-xs">
                      {/* Category Header with Bulk Select */}
                      <CardHeader className="p-3.5 pb-3 border-b bg-muted/30 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-primary">{Icon}</span>
                          <CardTitle className="text-sm font-bold uppercase tracking-wide">
                            {getDisplayName(category, URDU_CATEGORIES[category] || category, language)}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {syms.length}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedInCat < syms.length ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectAllInCategory(syms)}
                              className="text-[11px] h-7 text-primary hover:bg-primary/10"
                            >
                              Select All
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeselectAllInCategory(syms)}
                              className="text-[11px] h-7 text-destructive hover:bg-destructive/10"
                            >
                              Deselect
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {syms.map((sym) => {
                            const isSelected = selectedSymptomIds.includes(sym.id)
                            return (
                              <Badge
                                key={sym.id}
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={() => toggleSymptom(sym.id)}
                                className={`cursor-pointer transition-all py-1.5 px-3 text-xs gap-1.5 ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                    : 'hover:bg-primary/10 hover:border-primary/40'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="size-3" />}
                                <span>{sym.name}</span>
                              </Badge>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Zero State if no symptoms match */}
            {visibleSymptoms.length === 0 && (
              <Card className="p-12 text-center border-dashed border-2">
                <Search className="size-12 mx-auto mb-3 text-muted-foreground/40" />
                <h3 className="text-base font-semibold">No Symptoms Found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                  We could not find any symptoms matching &quot;{symptomSearch}&quot;.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSymptomSearch('')
                      setSelectedCategoryFilter('all')
                      handleClearAnatomyFilter()
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* ======================================================== */}
          {/* COLUMN 3: RIGHT SIDEBAR (CONSULTATION TRAY & CONTROLS)    */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-5 lg:sticky lg:top-24">
            <Card className="border-border/80 shadow-md bg-card overflow-hidden">
              {/* Card Header: Tray Summary */}
              <CardHeader className="p-4 pb-3 border-b bg-muted/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="size-4 text-primary" />
                    <CardTitle className="text-sm font-bold uppercase tracking-wider">
                      Consultation Tray
                    </CardTitle>
                  </div>
                  <Badge className="bg-primary text-primary-foreground text-xs px-2">
                    {selectedSymptomIds.length} Added
                  </Badge>
                </div>
                <CardDescription className="text-xs mt-1">
                  Active checklist for clinical ML prediction
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Diagnostic Readiness Progress */}
                <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border/50">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Readiness Meter</span>
                    <span className={diagnosticReadiness.level === 'optimal' ? 'text-emerald-500' : 'text-amber-500'}>
                      {diagnosticReadiness.percent}%
                    </span>
                  </div>
                  <Progress value={diagnosticReadiness.percent} className="h-2 rounded-full" />
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <Info className="size-3 shrink-0" />
                    <span>{diagnosticReadiness.label}</span>
                  </p>
                </div>

                {/* Selected Symptoms Chips Container */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Selected Indicators
                    </span>
                    {selectedSymptomIds.length > 0 && (
                      <button
                        type="button"
                        onClick={clearSelectedSymptoms}
                        className="text-[11px] text-destructive hover:underline cursor-pointer"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {selectedSymptoms.length > 0 ? (
                    <ScrollArea className="max-h-[220px] pr-2">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSymptoms.map((sym) => (
                          <Badge
                            key={sym.id}
                            variant="secondary"
                            className="text-xs py-1 px-2.5 gap-1.5 bg-primary/10 border border-primary/20 text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all cursor-pointer group"
                            onClick={() => toggleSymptom(sym.id)}
                            title="Click to remove"
                          >
                            <span className="truncate max-w-[140px]">{sym.name}</span>
                            <X className="size-3 text-muted-foreground group-hover:text-destructive" />
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="p-6 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                      <Stethoscope className="size-8 mx-auto mb-2 opacity-30" />
                      <p>Select symptoms from the center grid or 3D anatomy to begin.</p>
                    </div>
                  )}
                </div>

                {/* Dual Engine Selection */}
                <div className="pt-2 border-t space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Diagnostic AI Engine
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 rounded-lg border bg-muted/50 p-1">
                    <button
                      type="button"
                      onClick={() => setPredictionEngine('local-ml')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md text-xs transition-all ${
                        predictionEngine === 'local-ml'
                          ? 'bg-background shadow-xs font-bold text-primary border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ClipboardList className="size-3.5 mb-0.5" />
                      <span>Local ML</span>
                      <span className="text-[9px] opacity-70">1ms Matrix</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPredictionEngine('online-ai')}
                      className={`flex flex-col items-center justify-center p-2 rounded-md text-xs transition-all ${
                        predictionEngine === 'online-ai'
                          ? 'bg-background shadow-xs font-bold text-primary border'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Brain className="size-3.5 mb-0.5 text-primary" />
                      <span>Online AI</span>
                      <span className="text-[9px] opacity-70">Gemini 2.5</span>
                    </button>
                  </div>
                </div>

                {/* Privacy Mode Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    <div>
                      <span className="font-semibold block">Privacy Mode</span>
                      <span className="text-[10px] text-muted-foreground">Zero PHI persistence</span>
                    </div>
                  </div>
                  <Switch
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                </div>

                {/* PRIMARY ACTION BUTTON */}
                <div className="pt-2">
                  <Button
                    size="lg"
                    className="w-full h-12 text-sm font-bold gap-2 shadow-lg bg-primary text-primary-foreground hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group"
                    disabled={selectedSymptomIds.length === 0 || isPredicting}
                    onClick={handlePredict}
                  >
                    {isPredicting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Analyzing Symptoms...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="size-4 fill-primary-foreground group-hover:scale-110 transition-transform" />
                        <span>Run Clinical Diagnosis</span>
                        <ArrowRight className="size-4 ml-auto group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Tip: Press <kbd className="px-1 py-0.5 rounded bg-muted border font-mono">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-muted border font-mono">Enter</kbd> to predict
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Clinical Help Card */}
            <Card className="border-border/60 bg-muted/20 p-3.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Smart.Dr is a clinical decision-support system. In case of acute cardiac distress, respiratory failure, or trauma, contact emergency services immediately.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* 3. Full-Screen Predicting Backdrop Animation */}
      <AnimatePresence>
        {isPredicting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <Card className="p-8 text-center max-w-md w-full shadow-2xl border-primary/30 bg-card">
              <div className="relative size-20 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin flex items-center justify-center">
                  <HeartPulse className="size-8 text-primary animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight">Analyzing Clinical Manifestations</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-6">
                Executing {predictionEngine === 'online-ai' ? 'Gemini 2.5 Flash Generative AI' : 'Deterministic Statistical Vector Matrix'} against 42+ diseases...
              </p>

              <div className="space-y-2">
                <Progress value={85} className="h-1.5" />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                  <span>{selectedSymptomIds.length} Symptoms Vectorized</span>
                  <span>Generating Differential...</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
