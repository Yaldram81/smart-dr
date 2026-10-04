'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { getDisplayName, URDU_SYMPTOMS, URDU_CATEGORIES } from '@/lib/urdu-translations'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Stethoscope, Brain, ClipboardList, Zap, Loader2,
  Thermometer, Wind, Droplets, HeartPulse, Shield,
  AlertTriangle, Search, CheckCircle2, X, Sparkles,
  User as UserIcon, ChevronDown, ChevronRight
} from 'lucide-react'

import { VoiceInputButton } from '@/components/symptom-checker/voice-input-button'
import { SymptomBodyMap, CATEGORY_ICONS, BODY_REGIONS } from '@/components/symptom-checker/symptom-body-map'
import { EmergencyAlert } from '@/components/symptom-checker/emergency-alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import dynamic from 'next/dynamic'

const SymptomBodyMap3D = dynamic(
  () => import('@/components/symptom-checker/symptom-body-map-3d').then(mod => mod.SymptomBodyMap3D),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] w-full rounded-2xl bg-slate-950/60 border border-slate-800 animate-pulse flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="size-8 text-primary animate-spin" />
        <span className="text-xs">Loading 3D Anatomy Model...</span>
      </div>
    ),
  }
)

function SymptomCheckerTab() {
  const {
    symptoms, setSymptoms, selectedSymptomIds, toggleSymptom, clearSelectedSymptoms,
    isPredicting, setIsPredicting, setPredictions, setLlmAnalysis, setActiveSection,
    user, symptomSearch, setSymptomSearch, isLoadingSymptoms, setIsLoadingSymptoms,
    predictionEngine, setPredictionEngine, language, privacyMode, setPrivacyMode,
  } = useAppStore()

  const [categories, setCategories] = useState<Record<string, { id: string; name: string; description: string | null }[]>>({})
  const [bodyRegion, setBodyRegion] = useState<string | null>(null)
  const [selected3DCategories, setSelected3DCategories] = useState<string[] | null>(null)
  const [selected3DLabel, setSelected3DLabel] = useState<string | null>(null)
  const [bodyMapMode, setBodyMapMode] = useState<'3d' | '2d'>('3d')
  const [showBodyMap, setShowBodyMap] = useState(false)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})

  // Fetch symptoms on mount
  useEffect(() => {
    const fetchSymptoms = async () => {
      setIsLoadingSymptoms(true)
      try {
        const res = await fetch('/api/symptoms')
        const data = await res.json()
        setSymptoms(data.symptoms)
        setCategories(data.categories)
      } catch {
        toast({ title: 'Error', description: 'Failed to load symptoms', variant: 'destructive' })
      } finally {
        setIsLoadingSymptoms(false)
      }
    }
    fetchSymptoms()
  }, [setSymptoms, setIsLoadingSymptoms])

  // Filter symptoms based on search, 3D organ selection, and 2D body region
  const filteredCategories = useMemo(() => {
    let cats = categories

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
  }, [categories, symptomSearch, bodyRegion, selected3DCategories])

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

  // Auto-expand categories that have selected symptoms
  useEffect(() => {
    const autoOpen: Record<string, boolean> = {}
    for (const cat of Object.keys(selectedCountByCategory)) {
      if (selectedCountByCategory[cat] > 0 && openCategories[cat] === undefined) {
        autoOpen[cat] = true
      }
    }
    if (Object.keys(autoOpen).length > 0) {
      setOpenCategories(prev => ({ ...prev, ...autoOpen }))
    }
  }, [selectedCountByCategory])

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }))
  }

  const expandAll = () => {
    const all: Record<string, boolean> = {}
    for (const cat of Object.keys(filteredCategories)) {
      all[cat] = true
    }
    setOpenCategories(all)
  }

  const collapseAll = () => {
    setOpenCategories({})
  }

  // Quick select combinations
  const quickSelectCombinations = useMemo(() => [
    { label: language === 'ur' ? 'فلو جیسا' : 'Flu-like', icon: <Thermometer className="size-3.5" />, symptomNames: ['Fever', 'Cough', 'Fatigue', 'Headache'] },
    { label: language === 'ur' ? 'زکام' : 'Cold', icon: <Wind className="size-3.5" />, symptomNames: ['Runny nose', 'Sneezing', 'Sore throat', 'Cough'] },
    { label: language === 'ur' ? 'پیٹ کے مسائل' : 'Stomach Issues', icon: <Droplets className="size-3.5" />, symptomNames: ['Nausea', 'Vomiting', 'Abdominal pain', 'Diarrhea'] },
    { label: language === 'ur' ? 'دل کے مسائل' : 'Heart Concerns', icon: <HeartPulse className="size-3.5" />, symptomNames: ['Chest pain', 'Irregular heartbeat', 'Shortness of breath'] },
  ], [language])

  const handleQuickSelect = (symptomNames: string[]) => {
    const matchingSymptoms = symptoms.filter(s =>
      symptomNames.some(name => s.name.toLowerCase().includes(name.toLowerCase()))
    )
    for (const sym of matchingSymptoms) {
      if (!selectedSymptomIds.includes(sym.id)) {
        toggleSymptom(sym.id)
      }
    }
    if (matchingSymptoms.length > 0) {
      toast({ title: 'Symptoms selected', description: `Added ${matchingSymptoms.length} symptoms from quick select` })
    }
  }

  const handlePredict = async () => {
    if (selectedSymptomIds.length === 0) {
      toast({ title: 'No symptoms selected', description: 'Please select at least one symptom', variant: 'destructive' })
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
        toast({ title: 'Prediction Failed', description: data.error || 'Something went wrong', variant: 'destructive' })
        return
      }
      setPredictions(data.predictions)
      setLlmAnalysis(data.llmAnalysis)
      if (data.predictions.length === 0) {
        toast({ title: 'No matches found', description: 'Try selecting more or different symptoms.' })
      } else {
        setActiveSection('results')
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to get predictions', variant: 'destructive' })
    } finally {
      setIsPredicting(false)
    }
  }

  if (isLoadingSymptoms) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <EmergencyAlert />
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Stethoscope className="size-8 text-primary" />
          Symptom Checker
        </h2>
        <p className="text-muted-foreground mt-2">Select your symptoms to get AI-powered disease predictions</p>
      </div>

      {/* Predict Disease Action Bar - Prominent Top Position */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-md border-b supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              size="lg"
              className="px-8 text-base gap-2 shadow-lg disabled:opacity-50 bg-primary text-primary-foreground hover:shadow-xl transition-all"
              disabled={selectedSymptomIds.length === 0 || isPredicting}
              onClick={handlePredict}
            >
              {isPredicting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Zap className="size-5" />
                  Predict Disease
                </>
              )}
            </Button>

            {/* Dual-Engine Prediction Toggle (per proposal: Local ML + Online AI) */}
            <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
              <button
                onClick={() => setPredictionEngine('local-ml')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  predictionEngine === 'local-ml'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <ClipboardList className="size-3.5" />
                <span>Local ML</span>
              </button>
              <button
                onClick={() => setPredictionEngine('online-ai')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  predictionEngine === 'online-ai'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Brain className="size-3.5" />
                <span>Online AI</span>
              </button>
            </div>

            {selectedSymptomIds.length > 0 && (
              <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-sm font-medium">
                {selectedSymptomIds.length} symptom{selectedSymptomIds.length !== 1 ? 's' : ''} selected
              </Badge>
            )}
            {selectedSymptomIds.length > 0 && selectedSymptomIds.length < 3 && (
              <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="size-3" />
                Add more for better accuracy
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showBodyMap ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setShowBodyMap(!showBodyMap)
                if (showBodyMap) {
                  setBodyRegion(null)
                  setSelected3DCategories(null)
                  setSelected3DLabel(null)
                }
              }}
              className="gap-2"
            >
              <UserIcon className="size-4" />
              {showBodyMap ? 'Hide' : 'Show'} Anatomy Map
            </Button>
            {(selected3DLabel || (bodyRegion && BODY_REGIONS[bodyRegion])) && (
              <Badge variant="secondary" className="gap-1">
                Filtering: {selected3DLabel || (bodyRegion ? BODY_REGIONS[bodyRegion]?.label : '')}
                <button
                  onClick={() => {
                    setBodyRegion(null)
                    setSelected3DCategories(null)
                    setSelected3DLabel(null)
                  }}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Privacy Mode Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/50 border">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <span className="text-sm font-medium">Privacy Mode</span>
          <span className="text-xs text-muted-foreground">(Zero data storage)</span>
        </div>
        <Switch
          checked={privacyMode}
          onCheckedChange={setPrivacyMode}
        />
      </div>

      {/* Quick Select Combinations */}
      {!isLoadingSymptoms && symptoms.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {quickSelectCombinations.map(combo => (
              <Button
                key={combo.label}
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => handleQuickSelect(combo.symptomNames)}
              >
                {combo.icon}
                {combo.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Interactive Anatomy Map Container (3D Model / 2D Diagram) */}
        <AnimatePresence>
          {showBodyMap && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full lg:w-[420px] shrink-0"
            >
              <Card className="p-4 border border-border/80 shadow-lg">
                {/* 3D vs 2D Mode Switcher Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-cyan-500 animate-pulse" />
                    <span className="text-xs font-bold text-foreground">
                      {bodyMapMode === '3d' ? '3D Human Anatomy' : '2D Diagram'}
                    </span>
                  </div>

                  <div className="flex items-center rounded-lg border bg-muted/60 p-0.5">
                    <button
                      onClick={() => setBodyMapMode('3d')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        bodyMapMode === '3d'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      3D Model
                    </button>
                    <button
                      onClick={() => setBodyMapMode('2d')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        bodyMapMode === '2d'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      2D Diagram
                    </button>
                  </div>
                </div>

                {bodyMapMode === '3d' ? (
                  <SymptomBodyMap3D
                    activeRegion={bodyRegion}
                    onSelectCategories={(cats, label) => {
                      setSelected3DCategories(cats)
                      setSelected3DLabel(label)
                      setBodyRegion(null)
                    }}
                  />
                ) : (
                  <SymptomBodyMap
                    activeRegion={bodyRegion}
                    setActiveRegion={(r) => {
                      setBodyRegion(r)
                      setSelected3DCategories(null)
                      setSelected3DLabel(null)
                    }}
                  />
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main symptom selection area */}
        <div className="flex-1 min-w-0">
          {/* Selected symptoms bar */}
          {selectedSymptomIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      Selected Symptoms ({selectedSymptomIds.length})
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearSelectedSymptoms} className="text-destructive hover:text-destructive h-7 text-xs">
                      <X className="size-3 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((sym) => (
                      <Badge
                        key={sym.id}
                        variant="default"
                        className="cursor-pointer hover:bg-destructive transition-colors py-1 px-3 gap-1"
                        onClick={() => toggleSymptom(sym.id)}
                      >
                        {getDisplayName(sym.name, URDU_SYMPTOMS[sym.name] || sym.name, language)}
                        <X className="size-3" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search with Voice Input */}
          <div className="relative mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ur' ? 'علامات تلاش کریں... یا آواز کے ذریعے 🎤' : 'Search symptoms... or use voice input 🎤'}
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <VoiceInputButton onResult={setSymptomSearch} />
          </div>

          {/* Expand / Collapse All */}
          {Object.keys(filteredCategories).length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs gap-1.5 h-7">
                <ChevronDown className="size-3" />
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs gap-1.5 h-7">
                <ChevronRight className="size-3" />
                Collapse All
              </Button>
            </div>
          )}

          {/* Symptoms by category — collapsible */}
          <ScrollArea className="max-h-[60vh] custom-scrollbar pr-4">
            <div className="space-y-2">
              {Object.entries(filteredCategories).map(([category, syms]) => {
                const isOpen = !!openCategories[category]
                const selectedInCat = selectedCountByCategory[category] || 0
                return (
                  <Collapsible
                    key={category}
                    open={isOpen}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center gap-2.5 py-2.5 px-3 rounded-lg border bg-card hover:bg-muted/50 transition-all group text-left">
                        <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? '' : '-rotate-90'}`} />
                        <span className="shrink-0 mt-0.5">{CATEGORY_ICONS[category] || <ClipboardList className="size-4" />}</span>
                        <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground flex-1">{getDisplayName(category, URDU_CATEGORIES[category] || category, language)}</h3>
                        <Badge variant="secondary" className="text-xs shrink-0">{syms.length}</Badge>
                        {selectedInCat > 0 && (
                          <Badge className="text-xs shrink-0 bg-primary text-primary-foreground">
                            {selectedInCat} selected
                          </Badge>
                        )}
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-wrap gap-2 px-3 py-3">
                        {syms.map((sym) => {
                          const isSelected = selectedSymptomIds.includes(sym.id)
                          return (
                            <Badge
                              key={sym.id}
                              variant={isSelected ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all py-1.5 px-3 text-sm ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground shadow-sm'
                                  : 'hover:bg-primary/10 hover:border-primary/30 hover:shadow-sm'
                              }`}
                              onClick={() => toggleSymptom(sym.id)}
                            >
                              {isSelected && <CheckCircle2 className="size-3 mr-1" />}
                              {getDisplayName(sym.name, URDU_SYMPTOMS[sym.name] || sym.name, language)}
                            </Badge>
                          )
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
              {Object.keys(filteredCategories).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="size-12 mx-auto mb-4 opacity-30" />
                  <p>No symptoms found matching &quot;{symptomSearch}&quot;</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Enhanced Loading overlay */}
      <AnimatePresence>
        {isPredicting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <Card className="p-8 text-center max-w-md shadow-xl glass-card">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="size-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary"
              />
              <h3 className="text-xl font-semibold mb-2">Analyzing Your Symptoms</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our AI engine is comparing your symptoms against 42+ diseases...
              </p>
              <div className="space-y-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-1.5 bg-primary/20 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-primary rounded-full" />
                </motion.div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Matching symptoms...</span>
                  <span>Generating analysis...</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Brain className="size-3.5 animate-pulse" />
                <span>AI Engine Processing</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SymptomCheckerTab
