'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList, Brain, CheckCircle2
} from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Select Symptoms',
      description: 'Browse 187+ symptoms organized by body category and select the ones you are experiencing.',
      icon: <ClipboardList className="size-6" />,
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our AI engine analyzes your symptoms against 42+ diseases using weighted matching and LLM enhancement.',
      icon: <Brain className="size-6" />,
    },
    {
      step: '03',
      title: 'Get Results',
      description: 'Receive detailed predictions with confidence scores, specialist recommendations, and health advice.',
      icon: <CheckCircle2 className="size-6" />,
    },
  ]

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Get health insights in three simple steps
            </p>
          </motion.div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
          {/* Dashed connectors between steps */}
          <div className="hidden md:block absolute top-1/2 left-[calc(33.33%+0.5rem)] right-[calc(33.33%+0.5rem)] h-0 border-t-2 border-dashed border-primary/20 -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <Card className="h-full text-center hover:shadow-lg transition-all hover:-translate-y-0.5 border-border/50 hover:border-primary/20 group p-6 relative overflow-hidden glass-card">
                {/* Step number */}
                <div className="text-7xl font-black text-primary/5 absolute -top-2 left-1/2 -translate-x-1/2 select-none">
                  {step.step}
                </div>
                {/* Icon */}
                <div className="mx-auto size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 relative group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
