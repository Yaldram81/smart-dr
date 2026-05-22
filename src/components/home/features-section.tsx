'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import {
  ShieldCheck, Brain, UserCheck, TrendingUp, Calculator, History, ArrowRight
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    { icon: <ShieldCheck className="size-5" />, title: 'Dataset-Based Prediction', description: 'Weighted symptom matching against a comprehensive disease-symptom database with confidence scoring.' },
    { icon: <Brain className="size-5" />, title: 'AI-Enhanced Analysis', description: 'LLM-powered detailed health analysis with personalized recommendations and insights.' },
    { icon: <UserCheck className="size-5" />, title: 'Doctor Recommendations', description: 'Get specialist recommendations based on your symptoms and predicted conditions.' },
    { icon: <TrendingUp className="size-5" />, title: 'Health Dashboard', description: 'Track your health metrics, BMI, and view prediction history all in one place.' },
    { icon: <Calculator className="size-5" />, title: 'BMI Calculator', description: 'Calculate your Body Mass Index and understand your health category.' },
    { icon: <History className="size-5" />, title: 'Prediction History', description: 'Save and review all your past predictions and health analyses over time.' },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Health Tools</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Everything you need for informed health decisions
            </p>
          </motion.div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-all hover:-translate-y-0.5 hover:border-primary/20 group flex flex-col glass-card glass-card-hover">
                <CardHeader className="pb-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors group/link" onClick={() => useAppStore.getState().setActiveSection('checker')}>
                    Learn more
                    <ArrowRight className="size-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
