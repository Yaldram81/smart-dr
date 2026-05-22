'use client'

import React, { useState, useMemo } from 'react'
import { useAppStore } from '@/lib/store'
import { useHydrated } from '@/components/hooks/use-hydrated'
import type { Notification } from '@/components/types'
import { Sparkles, UserCheck, Apple, History, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

const HEALTH_TIPS = [
  'Stay hydrated — drink at least 8 glasses of water daily.',
  'Get 7-9 hours of sleep for optimal immune function.',
  'Regular exercise boosts your immune system by up to 50%.',
  'Wash your hands frequently to prevent infections.',
  'Eat a balanced diet rich in fruits and vegetables.',
]

export function NotificationBell() {
  const { user, history } = useAppStore()
  const mounted = useHydrated()
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState(false)

  // Build notifications list
  const notifications = useMemo(() => {
    if (!mounted) return []
    let readIds: string[] = []
    try {
      const stored = localStorage.getItem('medpredict_read_notifications')
      readIds = stored ? JSON.parse(stored) : []
    } catch { /* ignore */ }

    const notifs: Notification[] = []

    // Welcome notification (always for new users)
    notifs.push({
      id: 'welcome',
      title: 'Welcome to Smart.Dr!',
      description: 'Start by selecting your symptoms to get AI-powered health predictions.',
      icon: <Sparkles className="size-4 text-primary" />,
      read: readIds.includes('welcome') || !!readOverrides['welcome'],
      type: 'welcome',
    })

    // Profile completion notification
    if (!user?.age || !user?.gender) {
      notifs.push({
        id: 'profile',
        title: 'Complete your health profile',
        description: 'Add your age and gender for better predictions.',
        icon: <UserCheck className="size-4 text-primary" />,
        read: readIds.includes('profile') || !!readOverrides['profile'],
        type: 'profile',
      })
    }

    // Health tip of the day
    const today = new Date()
    const tipIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % HEALTH_TIPS.length
    notifs.push({
      id: `tip-${tipIndex}`,
      title: 'Health Tip of the Day',
      description: HEALTH_TIPS[tipIndex],
      icon: <Apple className="size-4 text-primary" />,
      read: readIds.includes(`tip-${tipIndex}`) || !!readOverrides[`tip-${tipIndex}`],
      type: 'tip',
    })

    // Prediction history notification
    if (user && history.length > 0) {
      notifs.push({
        id: 'history',
        title: `${history.length} prediction${history.length !== 1 ? 's' : ''} in your history`,
        description: 'Review your past health analyses in the dashboard.',
        icon: <History className="size-4 text-primary" />,
        read: readIds.includes('history') || !!readOverrides['history'],
        type: 'history',
      })
    }

    return notifs
  }, [mounted, user, history, readOverrides])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setReadOverrides(prev => ({ ...prev, [id]: true }))
    try {
      const stored = localStorage.getItem('medpredict_read_notifications')
      const readIds: string[] = stored ? JSON.parse(stored) : []
      if (!readIds.includes(id)) {
        readIds.push(id)
        localStorage.setItem('medpredict_read_notifications', JSON.stringify(readIds))
      }
    } catch {
      // ignore
    }
  }

  const markAllRead = () => {
    const overrides: Record<string, boolean> = {}
    for (const n of notifications) {
      overrides[n.id] = true
    }
    setReadOverrides(overrides)
    try {
      const allIds = notifications.map(n => n.id)
      localStorage.setItem('medpredict_read_notifications', JSON.stringify(allIds))
    } catch {
      // ignore
    }
  }

  if (!mounted) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="size-9 relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex gap-3 ${
                  !notif.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="mt-0.5 shrink-0">{notif.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{notif.title}</p>
                    {!notif.read && (
                      <span className="size-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.description}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
