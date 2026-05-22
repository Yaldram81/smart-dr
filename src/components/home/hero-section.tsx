'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { LoginDialog } from '@/components/layout/login-dialog'
import { RegisterDialog } from '@/components/layout/register-dialog'
import {
  Plus, Stethoscope, ArrowRight, TrendingUp, Sparkles, HeartPulse,
  LogIn, UserPlus, Shield
} from 'lucide-react'

export function HeroSection() {
  const { setActiveSection, user } = useAppStore()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  return (
    <section className="relative overflow-hidden gradient-border rounded-2xl m-2">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.55_0.17_160/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.55_0.17_160/0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] rounded-2xl" />

      {/* Particle/dot animation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hero-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle"
            style={{
              left: `${(i * 3.33) % 100}%`,
              top: `${(i * 7.77 + 10) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + (i % 4) * 2}s`,
              opacity: 0.15 + (i % 5) * 0.06,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
            }}
          />
        ))}
      </div>

      {/* Floating medical cross icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[10%] text-primary/10"
          animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Plus className="size-8" />
        </motion.div>
        <motion.div
          className="absolute top-[25%] right-[15%] text-primary/8"
          animate={{ y: [6, -10, 6], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Plus className="size-6" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30%] left-[20%] text-primary/6"
          animate={{ y: [-5, 7, -5], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Plus className="size-10" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] right-[10%] text-primary/10"
          animate={{ y: [4, -6, 4], rotate: [0, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Plus className="size-7" />
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6 px-3 py-1 text-sm font-medium shimmer-badge">
              <Sparkles className="size-3.5 mr-1.5" />
              AI-Powered Health Analysis
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="hero-gradient-text">Smart Disease Prediction</span>{' '}
            <span className="text-primary">From Your Symptoms</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Select your symptoms and get instant AI-analyzed disease predictions with 
            specialist recommendations and personalized health advice.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground px-8 text-base gap-2 shadow-lg hover:shadow-xl transition-all animate-[pulse-glow_3s_ease-in-out_infinite] group"
              onClick={() => setActiveSection('checker')}
            >
              <Stethoscope className="size-5 animate-[breathe_3s_ease-in-out_infinite]" />
              Start Symptom Check
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform animate-[bounce-subtle_2s_ease-in-out_infinite]" />
            </Button>
            {user ? (
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-base gap-2"
                onClick={() => setActiveSection('dashboard')}
              >
                <TrendingUp className="size-5" />
                View Dashboard
              </Button>
            ) : null}
          </motion.div>

          {/* Login / Register buttons — shown only when not logged in */}
          {!user && (
            <motion.div
              className="mt-6 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              {/* Divider with text */}
              <div className="flex items-center gap-3 w-full max-w-xs">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">or get started</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              {/* Login & Register buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 w-full sm:w-auto px-6 text-base gap-2.5 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all group"
                    >
                      <LogIn className="size-4.5 group-hover:translate-x-0.5 transition-transform" />
                      <span>Login</span>
                    </Button>
                  </DialogTrigger>
                  <LoginDialog
                    onClose={() => setLoginOpen(false)}
                    onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }}
                  />
                </Dialog>

                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="flex-1 w-full sm:w-auto px-6 text-base gap-2.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:brightness-110 transition-all group"
                    >
                      <UserPlus className="size-4.5 group-hover:scale-110 transition-transform" />
                      <span>Register Free</span>
                    </Button>
                  </DialogTrigger>
                  <RegisterDialog
                    onClose={() => setRegisterOpen(false)}
                    onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }}
                  />
                </Dialog>
              </div>

              {/* Trust indicator */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mt-1">
                <Shield className="size-3" />
                <span>No credit card required — 100% free & secure</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
