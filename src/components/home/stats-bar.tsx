'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck, ClipboardList, Brain, Shield
} from 'lucide-react'

export function StatsBar() {
  const stats = [
    { value: '42+', label: 'Diseases', icon: <ShieldCheck className="size-5" /> },
    { value: '187+', label: 'Symptoms', icon: <ClipboardList className="size-5" /> },
    { value: 'AI', label: 'Analysis', icon: <Brain className="size-5" /> },
    { value: '100%', label: 'Secure', icon: <Shield className="size-5" /> },
  ]

  return (
    <section className="border-y bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 justify-center rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow glass-card glass-card-hover"
            >
              <div className="text-primary">{stat.icon}</div>
              <div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
