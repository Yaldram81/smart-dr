'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator } from 'lucide-react'

export function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)

  const calculateBMI = () => {
    const h = parseFloat(height)
    const w = parseFloat(weight)
    if (!h || !w || h <= 0 || w <= 0) {
      toast({ title: 'Invalid input', description: 'Please enter valid height and weight', variant: 'destructive' })
      return
    }
    const heightInMeters = h / 100
    const calculated = w / (heightInMeters * heightInMeters)
    setBmi(Math.round(calculated * 10) / 10)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', gaugeColor: '#3b82f6' }
    if (bmi < 25) return { label: 'Normal', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', gaugeColor: '#10b981' }
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', gaugeColor: '#f59e0b' }
    return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', gaugeColor: '#ef4444' }
  }

  const gaugePosition = bmi ? Math.max(0, Math.min(((bmi - 10) / 30) * 100, 100)) : 0

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="size-5 text-primary" />
          BMI Calculator
        </CardTitle>
        <CardDescription>Calculate your Body Mass Index</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>
        <Button onClick={calculateBMI} className="w-full bg-primary text-primary-foreground gap-2">
          <Calculator className="size-4" />
          Calculate BMI
        </Button>
        {bmi !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg ${getBMICategory(bmi).bg} text-center`}
          >
            <div className={`text-3xl font-bold ${getBMICategory(bmi).color}`}>{bmi}</div>
            <div className={`text-sm font-medium ${getBMICategory(bmi).color}`}>{getBMICategory(bmi).label}</div>

            <div className="mt-4 relative">
              <div className="bmi-gauge-track">
                <div
                  className="bmi-gauge-indicator"
                  style={{ left: `${gaugePosition}%`, color: getBMICategory(bmi).gaugeColor }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
              <div className="flex justify-between text-xs mt-0.5">
                <span className="text-blue-500">Under</span>
                <span className="text-emerald-500">Normal</span>
                <span className="text-amber-500">Over</span>
                <span className="text-red-500">Obese</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
