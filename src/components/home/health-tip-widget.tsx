'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Share2, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

const healthTips = [
  {
    tip: 'Stay hydrated! Drinking 8 glasses of water daily helps maintain body temperature, lubricates joints, and flushes out toxins.',
    category: 'Hydration',
  },
  {
    tip: 'A 10-minute walk after meals can significantly improve digestion and help regulate blood sugar levels.',
    category: 'Exercise',
  },
  {
    tip: 'Getting 7-9 hours of sleep each night strengthens your immune system and improves cognitive function.',
    category: 'Sleep',
  },
  {
    tip: 'Deep breathing exercises for just 5 minutes a day can reduce stress hormones by up to 25%.',
    category: 'Mental Health',
  },
  {
    tip: 'Eating a rainbow of fruits and vegetables ensures you get a wide variety of essential vitamins and minerals.',
    category: 'Nutrition',
  },
  {
    tip: 'Regular hand washing for 20 seconds can prevent the spread of up to 80% of infectious diseases.',
    category: 'Hygiene',
  },
  {
    tip: 'Taking short screen breaks every 20 minutes reduces eye strain and improves focus throughout the day.',
    category: 'Wellness',
  },
  {
    tip: 'Stretching for 10 minutes in the morning improves flexibility, reduces muscle tension, and boosts energy.',
    category: 'Exercise',
  },
  {
    tip: 'Mindful eating — chewing slowly and savoring each bite — aids digestion and helps prevent overeating.',
    category: 'Nutrition',
  },
  {
    tip: 'Spending 20 minutes in nature daily can lower cortisol levels and improve overall mental well-being.',
    category: 'Mental Health',
  },
  {
    tip: 'Maintaining good posture while sitting reduces back pain risk by up to 40% and improves breathing.',
    category: 'Wellness',
  },
  {
    tip: 'Adding a handful of nuts to your daily diet provides healthy fats, protein, and essential minerals.',
    category: 'Nutrition',
  },
  {
    tip: 'Laughter boosts endorphins, strengthens the immune system, and can even relieve pain naturally.',
    category: 'Mental Health',
  },
  {
    tip: 'Limiting caffeine after 2 PM can dramatically improve your sleep quality and next-day alertness.',
    category: 'Sleep',
  },
  {
    tip: 'Regular dental check-ups every 6 months can catch early signs of gum disease, linked to heart health.',
    category: 'Prevention',
  },
  {
    tip: 'Keeping a gratitude journal for 5 minutes daily has been shown to improve mood and reduce anxiety.',
    category: 'Mental Health',
  },
  {
    tip: 'Eating breakfast within an hour of waking kickstarts your metabolism and stabilizes blood sugar.',
    category: 'Nutrition',
  },
  {
    tip: 'Social connections and meaningful relationships are linked to a 50% increased chance of longevity.',
    category: 'Wellness',
  },
  {
    tip: 'Replacing sugary drinks with water or herbal tea can cut up to 200 calories per day from your diet.',
    category: 'Hydration',
  },
  {
    tip: 'Practicing the 20-20-20 rule (every 20 min, look 20 feet away for 20 sec) protects your vision.',
    category: 'Wellness',
  },
  {
    tip: 'Exposure to morning sunlight helps regulate your circadian rhythm and improves sleep quality.',
    category: 'Sleep',
  },
  {
    tip: 'A 5-minute cold shower can boost circulation, reduce inflammation, and increase alertness.',
    category: 'Wellness',
  },
  {
    tip: 'Cooking at home instead of eating out lets you control ingredients, portions, and sodium intake.',
    category: 'Nutrition',
  },
  {
    tip: 'Reading for just 30 minutes a day reduces stress levels by 68%, more than listening to music or walking.',
    category: 'Mental Health',
  },
  {
    tip: 'Probiotic-rich foods like yogurt and kimchi support gut health, which influences immunity and mood.',
    category: 'Nutrition',
  },
  {
    tip: 'Standing up and moving every 30 minutes counteracts the negative effects of prolonged sitting.',
    category: 'Exercise',
  },
  {
    tip: 'Drinking green tea provides antioxidants that may reduce the risk of heart disease and certain cancers.',
    category: 'Hydration',
  },
  {
    tip: 'Setting a consistent bedtime and wake time — even on weekends — dramatically improves sleep quality.',
    category: 'Sleep',
  },
  {
    tip: 'Flossing daily removes plaque between teeth where brushes can\'t reach, preventing gum disease.',
    category: 'Hygiene',
  },
  {
    tip: 'A 15-minute power nap can restore alertness and improve motor skills without causing grogginess.',
    category: 'Sleep',
  },
  {
    tip: 'Eating slowly allows your brain to register fullness, typically taking about 20 minutes.',
    category: 'Nutrition',
  },
]

function getDailyTip() {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  const index = dayOfYear % healthTips.length
  return { ...healthTips[index], date: today }
}

export function HealthTipWidget() {
  const { tip, category, date } = getDailyTip()

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleShare = async () => {
    const shareText = `💡 Health Tip of the Day (${formattedDate}):\n\n${tip}\n\n— Smart.Dr`
    try {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: 'Tip Copied!',
        description: 'Health tip has been copied to your clipboard.',
      })
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />

            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 size-40 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-teal-500/10 blur-2xl" />

            {/* Content */}
            <div className="relative border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl p-6 md:p-8 glass-card">
              <div className="flex items-start gap-4 md:gap-5">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="shrink-0 size-14 md:size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"
                >
                  <Lightbulb className="size-7 md:size-8 text-white" />
                </motion.div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                      <Sparkles className="size-3" />
                      Tip of the Day
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-full px-2.5 py-0.5">
                      {category}
                    </span>
                  </div>

                  <p className="text-base md:text-lg font-medium leading-relaxed mb-4">
                    {tip}
                  </p>

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>{formattedDate}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="gap-1.5 text-xs border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                    >
                      <Share2 className="size-3.5" />
                      Share Tip
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
