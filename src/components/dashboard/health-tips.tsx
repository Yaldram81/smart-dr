'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Apple, Brain, Droplets, Heart, Moon, Shield } from 'lucide-react'

export function HealthTips() {
  const tips = [
    { icon: <Droplets className="size-5" />, title: 'Stay Hydrated', tip: 'Drink at least 8 glasses of water daily to maintain body functions and flush out toxins.' },
    { icon: <Apple className="size-5" />, title: 'Balanced Diet', tip: 'Include fruits, vegetables, whole grains, and lean proteins in your daily meals.' },
    { icon: <Activity className="size-5" />, title: 'Regular Exercise', tip: 'Aim for at least 30 minutes of moderate exercise most days of the week.' },
    { icon: <Moon className="size-5" />, title: 'Quality Sleep', tip: 'Get 7-9 hours of quality sleep each night for optimal health and recovery.' },
    { icon: <Shield className="size-5" />, title: 'Regular Check-ups', tip: 'Visit your healthcare provider for regular screenings and preventive care.' },
    { icon: <Brain className="size-5" />, title: 'Mental Health', tip: 'Practice stress management techniques like meditation, deep breathing, or yoga.' },
  ]

  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [tips.length])

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-rose-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="size-5 text-primary" />
          Health Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {tips[currentTip].icon}
              </div>
              <div>
                <h4 className="font-medium text-sm">{tips[currentTip].title}</h4>
                <p className="text-sm text-muted-foreground">{tips[currentTip].tip}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1.5 mt-4 justify-center">
          {tips.map((_, i) => (
            <button
              key={i}
              className={`size-2 rounded-full transition-all ${i === currentTip ? 'bg-primary w-6' : 'bg-muted-foreground/20 hover:bg-muted-foreground/40'}`}
              onClick={() => setCurrentTip(i)}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
