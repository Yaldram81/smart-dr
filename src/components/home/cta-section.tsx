'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeartPulse, Stethoscope, Shield } from 'lucide-react'

export function CTASection() {
  const { setActiveSection } = useAppStore()

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Animated gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 md:p-12">
              <HeartPulse className="size-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Check Your Symptoms?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Our AI-powered system analyzes 187+ symptoms against 42+ diseases to provide you with instant, detailed health predictions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground px-8 gap-2"
                  onClick={() => setActiveSection('checker')}
                >
                  <Stethoscope className="size-5" />
                  Start Now — It&apos;s Free
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                <Shield className="size-3" />
                Your data is private and secure
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
