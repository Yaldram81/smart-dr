'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Patient',
      quote: 'Smart.Dr helped me identify my symptoms early. The AI analysis was incredibly detailed and guided me to the right specialist.',
      avatar: 'SM',
      rating: 5,
    },
    {
      name: 'Dr. Raj P.',
      role: 'General Physician',
      quote: 'As a doctor, I recommend this tool to my patients for initial symptom assessment. The weighted matching algorithm provides reliable insights.',
      avatar: 'RP',
      rating: 5,
    },
    {
      name: 'Anita K.',
      role: 'Student',
      quote: 'This platform made me more aware of my health. The BMI calculator and health tips are great daily features. The prediction history helps track patterns.',
      avatar: 'AK',
      rating: 4,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What Users Say</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Trusted by patients and healthcare professionals alike
          </p>
          </motion.div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 hover:shadow-lg transition-all glass-card glass-card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">{t.name}</CardTitle>
                      <CardDescription className="text-xs">{t.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`size-3.5 ${si < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/20'}`}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
