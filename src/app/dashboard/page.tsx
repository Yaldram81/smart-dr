'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import DashboardTab from '@/components/dashboard/dashboard-tab'
import { Card, CardContent } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAppStore()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <Card className="border-border/60 shadow-lg">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="size-7" />
            </div>
            <h2 className="text-xl font-bold">Authentication Required</h2>
            <p className="text-sm text-muted-foreground">
              Please sign in using the Login button in the top navigation bar to access your personal health metrics, prediction history, and medication reminders.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <DashboardTab />
}
