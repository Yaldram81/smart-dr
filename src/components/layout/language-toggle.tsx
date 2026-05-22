'use client'

import { useAppStore } from '@/lib/store'
import type { Language } from '@/lib/urdu-translations'

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore()
  const options: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'اردو' },
    { value: 'both', label: 'Both' },
  ]
  return (
    <div className="flex items-center rounded-lg border bg-muted/50 p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
            language === opt.value
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          } ${opt.value === 'ur' ? 'font-urdu' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
