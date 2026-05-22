'use client'

import { motion } from 'framer-motion'
import { useAnimatedCounter } from '@/components/hooks/use-animated-counter'

export function ConfidenceBar({ confidence, animate: doAnimate }: { confidence: number; animate?: boolean }) {
  const getColor = (c: number) => {
    if (c >= 70) return 'bg-red-500'
    if (c >= 40) return 'bg-amber-500'
    return 'bg-emerald-500'
  }
  const animatedCount = useAnimatedCounter(confidence, 1200, doAnimate)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getColor(confidence)}`}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <span className="text-sm font-bold min-w-[3rem] text-right">
        {doAnimate ? animatedCount : confidence}%
      </span>
    </div>
  )
}
