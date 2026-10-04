'use client'

import React, { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
import { HealthChatbot } from '@/components/chat/health-chatbot'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore()

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
        // fallback to local storage if network fails
      }

      try {
        const stored = localStorage.getItem('medpredict_user')
        if (stored && isMounted) {
          const parsed = JSON.parse(stored)
          setUser(parsed)
        }
      } catch {
        // ignore storage parse errors
      }
    }
    hydrateSession()
    return () => {
      isMounted = false
    }
  }, [setUser])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <HealthChatbot />
    </div>
  )
}
