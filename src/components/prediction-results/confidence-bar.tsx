'use client'

import { motion } from 'framer-motion'
import { useAnimatedCounter } from '@/components/hooks/use-animated-counter'

export function ConfidenceBar({
  confidence,
  animate: doAnimate,
  size = 'md',
}: {
  confidence: number
  animate?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const getColor = (c: number) => {
    if (c >= 75) return 'bg-emerald-500 shadow-xs'
    if (c >= 50) return 'bg-primary shadow-xs'
    if (c >= 30) return 'bg-amber-500'
    return 'bg-slate-400'
  }
  const animatedCount = useAnimatedCounter(confidence, 1200, doAnimate)

  const heightClass = size === 'lg' ? 'h-3' : size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className={`flex-1 ${heightClass} bg-muted/80 rounded-full overflow-hidden border border-border/40 p-0.5`}>
        <motion.div
          className={`h-full rounded-full ${getColor(confidence)} transition-all`}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className={`font-bold min-w-[2.75rem] text-right text-foreground font-mono ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        {doAnimate ? animatedCount : confidence}%
      </span>
    </div>
  )
}

