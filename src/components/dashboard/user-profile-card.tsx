'use client'

import React from 'react'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck, HeartPulse, Stethoscope, Printer,
  LogOut, PhoneCall, Sparkles, User as UserIcon, Calendar, Activity
} from 'lucide-react'

interface UserProfileCardProps {
  onExportDossier?: () => void
}

export function UserProfileCard({ onExportDossier }: UserProfileCardProps) {
  const { user, logout, privacyMode } = useAppStore()

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'PT'

  return (
    <Card className="overflow-hidden border-border/70 shadow-md glass-card relative">
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-primary" />
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Patient Avatar & Core Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <Avatar className="size-16 sm:size-20 border-2 border-primary/30 shadow-md ring-4 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-tr from-emerald-600 to-teal-700 text-white text-xl sm:text-2xl font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center shadow-sm" title="Active Patient Profile">
                <span className="size-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-xl sm:text-2xl tracking-tight text-foreground">
                  {user.name}
                </h3>
                <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary bg-primary/5">
                  ID: #SD-{user.id.slice(-4).toUpperCase()}
                </Badge>
                {user.id.startsWith('demo-') && (
                  <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Sparkles className="size-3 mr-1" />
                    Demo Patient
                  </Badge>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {user.email}
              </p>

              {/* Patient Demographics Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {user.age && (
                  <Badge variant="outline" className="text-xs font-medium bg-muted/40">
                    <Calendar className="size-3 mr-1 opacity-70" />
                    {user.age} Years
                  </Badge>
                )}
                {user.gender && (
                  <Badge variant="outline" className="text-xs font-medium capitalize bg-muted/40">
                    <UserIcon className="size-3 mr-1 opacity-70" />
                    {user.gender}
                  </Badge>
                )}
                {user.bloodGroup && (
                  <Badge variant="outline" className="text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-950/20">
                    Blood Group: {user.bloodGroup}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20">
                  <Activity className="size-3 mr-1" />
                  Monitoring Active
                </Badge>
                {privacyMode && (
                  <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
                    <ShieldCheck className="size-3 mr-1" />
                    Zero-PHI Mode
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/50">
            <Link href="/checker">
              <Button size="sm" className="gap-1.5 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                <Stethoscope className="size-4" />
                <span>New Triage Check</span>
              </Button>
            </Link>

            <Button
              size="sm"
              variant="outline"
              onClick={onExportDossier || (() => window.print())}
              className="gap-1.5 border-border/70 hover:border-primary/40 hover:bg-primary/5"
            >
              <Printer className="size-4" />
              <span>Export Dossier</span>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={logout}
              className="gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Sign Out or Exit Demo"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
