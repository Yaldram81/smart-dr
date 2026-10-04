'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Stethoscope, BookOpen, Users,
  Activity, ArrowRight, ShieldCheck, HelpCircle,
  FileText, HeartPulse
} from 'lucide-react'

// Header & Persistent Home Sections
import { HeroSection } from '@/components/home/hero-section'
import { StatsBar } from '@/components/home/stats-bar'
import { CTASection } from '@/components/home/cta-section'
import { SectionDivider } from '@/components/layout/section-divider'

// Tab 1: Overview & Core Features
import { EmergencyQuickActions } from '@/components/home/emergency-quick-actions'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { FeaturesSection } from '@/components/home/features-section'
import { HealthTipWidget } from '@/components/home/health-tip-widget'

// Tab 2: Disease Knowledge Directory
import { DiseaseBrowserSection } from '@/components/home/disease-browser-section'

// Tab 3: Health Insights & FAQ
import { BlogSection } from '@/components/home/blog-section'
import { FAQSection } from '@/components/home/faq-section'

// Tab 4: About, Team & Trust
import { AboutSection } from '@/components/home/about-section'
import { DeveloperSection } from '@/components/home/developer-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { ContactSection } from '@/components/home/contact-section'

export type HomeTabKey = 'overview' | 'diseases' | 'insights' | 'about'

interface TabOption {
  key: HomeTabKey
  label: string
  sublabel: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const TABS: TabOption[] = [
  {
    key: 'overview',
    label: 'Overview & Features',
    sublabel: 'How it works & Core AI capabilities',
    icon: Sparkles,
    badge: 'Popular',
  },
  {
    key: 'diseases',
    label: 'Disease Directory',
    sublabel: '42+ clinical conditions & Urdu guides',
    icon: Stethoscope,
    badge: '42+ Diseases',
  },
  {
    key: 'insights',
    label: 'Health Insights & FAQ',
    sublabel: 'Medical articles, tips & patient questions',
    icon: BookOpen,
  },
  {
    key: 'about',
    label: 'About & Clinical Team',
    sublabel: 'Mission, UOM IT Dept & Testimonials',
    icon: Users,
  },
]

export default function HomeTab() {
  const [activeTab, setActiveTab] = useState<HomeTabKey>('overview')
  const tabsBarRef = useRef<HTMLDivElement>(null)

  // Listen to hash changes (e.g. #diseases, #faq, #about) to auto-open relevant tab
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase()
      if (hash.includes('disease') || hash.includes('condition')) {
        setActiveTab('diseases')
      } else if (hash.includes('faq') || hash.includes('blog') || hash.includes('insight') || hash.includes('tip')) {
        setActiveTab('insights')
      } else if (hash.includes('about') || hash.includes('team') || hash.includes('dev') || hash.includes('contact')) {
        setActiveTab('about')
      } else if (hash.includes('overview') || hash.includes('feature') || hash.includes('how')) {
        setActiveTab('overview')
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleTabSwitch = (key: HomeTabKey) => {
    setActiveTab(key)
    // Smoothly scroll to the tab bar if user is scrolled past it
    if (tabsBarRef.current) {
      const rect = tabsBarRef.current.getBoundingClientRect()
      if (rect.top < 70) {
        tabsBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Showcase */}
      <HeroSection />

      {/* 2. Key Stats Strip */}
      <SectionDivider />
      <StatsBar />

      {/* 3. Sticky Tabbed Navigation Anchor */}
      <div
        ref={tabsBarRef}
        className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-y border-border/60 py-3.5 shadow-sm transition-all"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Activity className="size-3.5 text-primary animate-pulse" />
              <span>Explore Section:</span>
            </div>

            {/* Segmented Tab Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 w-full lg:w-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabSwitch(tab.key)}
                    className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 bg-muted/40 border border-border/40'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabBadge"
                        className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-sm"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <Icon className={`size-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabbed Content Container with Motion */}
      <div className="flex-1 min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <EmergencyQuickActions />
              <SectionDivider />
              <HowItWorksSection />
              <SectionDivider />
              <FeaturesSection />
              <SectionDivider />
              <HealthTipWidget />
            </motion.div>
          )}

          {activeTab === 'diseases' && (
            <motion.div
              key="diseases"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <DiseaseBrowserSection />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <BlogSection />
              <SectionDivider />
              <FAQSection />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <AboutSection />
              <SectionDivider />
              <DeveloperSection />
              <SectionDivider />
              <TestimonialsSection />
              <SectionDivider />
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Persistent Bottom Conversion Call-to-Action */}
      <SectionDivider />
      <CTASection />
    </div>
  )
}
