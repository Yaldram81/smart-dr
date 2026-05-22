'use client'

import { useAppStore } from '@/lib/store'
import { getDisplayName, URDU_SEVERITY, type Language } from '@/lib/urdu-translations'
import { Badge } from '@/components/ui/badge'
import { Info, AlertTriangle } from 'lucide-react'

export function SeverityBadge({ severity, large, language: languageProp }: { severity: string; large?: boolean; language?: Language }) {
  const { language: storeLanguage } = useAppStore()
  const lang = languageProp || storeLanguage
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    mild: {
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      icon: <Info className="size-3" />,
    },
    moderate: {
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      icon: <AlertTriangle className="size-3" />,
    },
    severe: {
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      icon: <AlertTriangle className="size-3" />,
    },
  }
  const c = config[severity.toLowerCase()] || config.moderate
  return (
    <Badge
      variant="outline"
      className={`gap-1 border ${c.className} ${large ? 'px-3 py-1 text-sm' : ''}`}
    >
      {c.icon}
      {getDisplayName(severity, URDU_SEVERITY[severity.toLowerCase()] || severity, lang)}
    </Badge>
  )
}
