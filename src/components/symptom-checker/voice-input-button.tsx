'use client'

import React, { useState, useMemo, useRef } from 'react'
import { useHydrated } from '@/components/hooks/use-hydrated'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Mic, MicOff } from 'lucide-react'

export function VoiceInputButton({ onResult }: { onResult: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false)
  const mounted = useHydrated()
  const recognitionRef = useRef<{ stop: () => void } | null>(null)

  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
    return !!SpeechRecognition
  }, [])

  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast({ title: 'Not supported', description: 'Voice input is not supported in your browser', variant: 'destructive' })
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
      setIsListening(false)
      toast({ title: 'Voice captured', description: `"${transcript}"` })
    }

    recognition.onerror = () => {
      setIsListening(false)
      toast({ title: 'Voice error', description: 'Could not capture voice input. Please try again.', variant: 'destructive' })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  if (!mounted || !isSupported) return null

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
          {isListening ? 'Listening... click to stop' : 'Voice search'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
