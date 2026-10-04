'use client'

import React, { useState, useMemo, useRef } from 'react'
import { useHydrated } from '@/components/hooks/use-hydrated'
import { useAppStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Mic, MicOff } from 'lucide-react'

export function VoiceInputButton({ onResult }: { onResult: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false)
  const mounted = useHydrated()
  const { language } = useAppStore()
  const recognitionRef = useRef<{ stop: () => void } | null>(null)

  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false
    const win = window as any
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition)
  }, [])

  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const win = window as any
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({
        title: language === 'ur' ? 'معاونت دستیاب نہیں' : 'Not supported',
        description: language === 'ur'
          ? 'آپ کے براؤزر میں وائس ان پٹ کی سہولت میسر نہیں ہے'
          : 'Voice input is not supported in your browser (try Chrome/Edge)',
        variant: 'destructive'
      })
      return
    }

    const recognition = new SpeechRecognition()
    // Adaptive language selection: ur-PK for Urdu/Bilingual modes, en-US for English
    recognition.lang = language === 'ur' ? 'ur-PK' : (language === 'both' ? 'ur-PK' : 'en-US')
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
      setIsListening(false)
      toast({
        title: language === 'ur' ? 'آواز ریکارڈ ہو گئی' : 'Voice captured',
        description: `"${transcript}"`
      })
    }

    recognition.onerror = () => {
      setIsListening(false)
      toast({
        title: language === 'ur' ? 'خرابی' : 'Voice error',
        description: language === 'ur'
          ? 'آواز ریکارڈ کرنے میں رکاوٹ۔ براہ کرم دوبارہ کوشش کریں'
          : 'Could not capture voice input. Please check microphone permissions.',
        variant: 'destructive'
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setIsListening(false)
    }
  }

  if (!mounted || !isSupported) return null

  const tooltipLabel = isListening
    ? (language === 'ur' ? 'سن رہا ہے... روکنے کے لیے کلک کریں' : 'Listening... click to stop')
    : (language === 'ur' ? 'آواز سے علامات تلاش کریں' : 'Voice search (speaks in English / اردو)')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isListening ? 'default' : 'outline'}
            size="icon"
            onClick={toggleListening}
            className={`size-10 shrink-0 transition-all ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'hover:bg-primary/10 hover:border-primary/30'
            }`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
