'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  HeartPulse, ClipboardList, Brain, ShieldCheck, UserCheck, GraduationCap, Building2
} from 'lucide-react'

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="outline" className="mb-4">About Us</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">About Smart.Dr</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              A dual-engine AI-powered disease prediction system for informed health decisions
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="size-5 text-primary" />
                  What is Smart.Dr?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Smart.Dr is an innovative health technology platform that leverages artificial intelligence to provide 
                  symptom-based disease predictions. Our system helps users understand potential health conditions by 
                  analyzing their reported symptoms against a comprehensive medical database.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ClipboardList className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dataset Engine</p>
                      <p className="text-xs text-muted-foreground">Weighted symptom matching against 42+ diseases with 187+ symptoms for precise confidence scoring.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">AI Engine</p>
                      <p className="text-xs text-muted-foreground">LLM-powered natural language analysis for detailed health insights and personalized recommendations.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Privacy</p>
                      <p className="text-xs text-muted-foreground">Your health data is encrypted and never shared with third parties. Full control over your prediction history.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="size-5 text-primary" />
                  Academic & Developer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">University of Malakand</p>
                    <p className="text-xs text-muted-foreground">Department of Computer Science & Information Technology</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Project Supervisor</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="size-4 text-primary" />
                      <span className="text-sm font-medium">Dr. Fakhrud Din</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">Lead Developer</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="text-xs font-bold text-primary">TR</span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold">Tanzeel Ur Rahman</span>
                        <p className="text-[11px] text-muted-foreground">Lead Full-Stack & AI Systems Architect</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This project is developed as a Final Year Project for the BCS 8th Semester at the University of Malakand, 
                    Chakdara, Dir Lower, Khyber Pakhtunkhwa, Pakistan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
