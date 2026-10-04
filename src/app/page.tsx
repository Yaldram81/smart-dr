'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type ActiveSection } from '@/lib/store'
import { HeartPulse } from 'lucide-react'

// Layout components
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ScrollToTop } from '@/components/layout/scroll-to-top'

// Chat
import { HealthChatbot } from '@/components/chat/health-chatbot'

// Tab components - dynamically imported for performance
import dynamic from 'next/dynamic'

const HomeTab = dynamic(() => import('@/components/home/home-tab'), {
  ssr: false,
  loading: () => <ContentLoader />,
})
const SymptomCheckerTab = dynamic(() => import('@/components/symptom-checker/symptom-checker-tab'), {
  ssr: false,
  loading: () => <ContentLoader />,
})
const PredictionResultsTab = dynamic(() => import('@/components/prediction-results/prediction-results-tab'), {
  ssr: false,
  loading: () => <ContentLoader />,
})
const DashboardTab = dynamic(() => import('@/components/dashboard/dashboard-tab'), {
  ssr: false,
  loading: () => <ContentLoader />,
})

// Full-viewport loading placeholder so the footer never jumps up
function ContentLoader() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <HeartPulse className="size-12 text-primary animate-pulse" />
        <div className="absolute inset-0 size-12 rounded-full animate-ping bg-primary/20" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading Smart.Dr...</p>
    </div>
  )
}

// ============================================================
// MAIN PAGE - Thin Shell
// ============================================================
export default function Home() {
  const { activeSection, setUser, user, setActiveSection } = useAppStore()
  const [prevSection, setPrevSection] = useState<ActiveSection>('home')
  const [currentSection, setCurrentSection] = useState<ActiveSection>('home')

  // Track section changes for transition direction
  if (activeSection !== currentSection) {
    setPrevSection(currentSection)
    setCurrentSection(activeSection)
  }

  // Transition variants based on section changes
  const getTransitionVariants = (from: ActiveSection, to: ActiveSection) => {
    const sectionOrder: ActiveSection[] = ['home', 'checker', 'results', 'dashboard']
    const prevIndex = sectionOrder.indexOf(from)
    const nextIndex = sectionOrder.indexOf(to)
    const goingForward = nextIndex > prevIndex

    if (from === 'dashboard' && to === 'home') {
      return {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 60 },
      }
    }

    if (from === 'home' && to === 'checker') {
      return {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -60 },
      }
    }

    if (from === 'checker' && to === 'results') {
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -60 },
      }
    }

    if (from === 'results' && to === 'dashboard') {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    }

    return {
      initial: { opacity: 0, x: goingForward ? 60 : -60 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: goingForward ? -60 : 60 },
    }
  }

  const variants = getTransitionVariants(prevSection, currentSection)

  // Restore user session securely from HTTP-Only cookie via /api/auth/me
  useEffect(() => {
    let isMounted = true
    const hydrateSession = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          if (data.user && isMounted) {
            setUser(data.user)
            return
          }
        }
      } catch {
        // fallback to storage if offline
      }

      try {
        const stored = localStorage.getItem('medpredict_user')
        if (stored && isMounted) {
          const parsed = JSON.parse(stored)
          setUser(parsed)
        }
      } catch {
        // ignore
      }
    }
    hydrateSession()
    return () => { isMounted = false }
  }, [setUser])

  // Redirect from dashboard to home if user logs out
  useEffect(() => {
    if (activeSection === 'dashboard' && !user) {
      setActiveSection('home')
    }
  }, [activeSection, user, setActiveSection])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {activeSection === 'home' && <HomeTab />}
            {activeSection === 'checker' && <SymptomCheckerTab />}
            {activeSection === 'results' && <PredictionResultsTab />}
            {activeSection === 'dashboard' && (user ? <DashboardTab /> : null)}
          </motion.div>
        </AnimatePresence>
      </main>
      {activeSection === 'home' && <Footer />}
      <ScrollToTop />
      <HealthChatbot />
    </div>
  )
}
