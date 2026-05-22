'use client'

import React from 'react'
import {
  Thermometer, Wind, Eye, Bone, Brain, HeartPulse,
  ScanLine, Droplets, Sparkles, ClipboardList
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'General': <Thermometer className="size-4" />,
  'Respiratory': <Wind className="size-4" />,
  'Digestive': <Eye className="size-4" />,
  'Skin': <Eye className="size-4" />,
  'Musculoskeletal': <Bone className="size-4" />,
  'Neurological': <Brain className="size-4" />,
  'Cardiovascular': <HeartPulse className="size-4" />,
  'ENT': <ScanLine className="size-4" />,
  'Urinary': <Droplets className="size-4" />,
  'Mental Health': <Sparkles className="size-4" />,
  'Other': <ClipboardList className="size-4" />,
}

// Body map region to symptom category mapping
const BODY_REGIONS: Record<string, { label: string; categories: string[] }> = {
  head: { label: 'Head', categories: ['Neurological', 'ENT', 'General'] },
  chest: { label: 'Chest', categories: ['Cardiovascular', 'Respiratory'] },
  abdomen: { label: 'Abdomen', categories: ['Digestive', 'Urinary'] },
  arms: { label: 'Arms', categories: ['Musculoskeletal', 'Skin'] },
  legs: { label: 'Legs', categories: ['Musculoskeletal', 'General'] },
}

export { CATEGORY_ICONS, BODY_REGIONS }

export function SymptomBodyMap({ activeRegion, setActiveRegion }: { activeRegion: string | null; setActiveRegion: (r: string | null) => void }) {
  const regions = [
    { id: 'head', cx: 75, cy: 28, rx: 18, ry: 22 },
    { id: 'chest', cx: 75, cy: 68, rx: 28, ry: 20 },
    { id: 'abdomen', cx: 75, cy: 100, rx: 24, ry: 18 },
    { id: 'arms', cx: 30, cy: 75, rx: 14, ry: 28 },
    { id: 'legs', cx: 75, cy: 138, rx: 22, ry: 25 },
  ]

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 150 170" className="w-36 h-auto" aria-label="Body map for symptom selection">
        {/* Body outline */}
        <ellipse cx="75" cy="28" rx="18" ry="22" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
        <rect x="47" y="48" rx="8" width="56" height="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
        <rect x="51" y="82" rx="6" width="48" height="36" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
        <rect x="16" y="47" rx="6" width="28" height="56" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
        <rect x="106" y="47" rx="6" width="28" height="56" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
        <rect x="53" y="118" rx="6" width="20" height="46" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
        <rect x="77" y="118" rx="6" width="20" height="46" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />

        {/* Clickable regions */}
        {regions.map((r) => (
          <ellipse
            key={r.id}
            cx={r.cx}
            cy={r.cy}
            rx={r.rx}
            ry={r.ry}
            className={`body-region ${activeRegion === r.id ? 'active' : ''}`}
            onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)}
          >
            <title>{BODY_REGIONS[r.id]?.label || r.id}</title>
          </ellipse>
        ))}

        {/* Region labels */}
        {regions.map((r) => (
          <text
            key={`label-${r.id}`}
            x={r.cx}
            y={r.cy + 4}
            textAnchor="middle"
            className="fill-current text-[7px] pointer-events-none"
            style={{ fill: activeRegion === r.id ? 'oklch(0.55 0.17 160)' : 'oklch(0.5 0.02 155)' }}
          >
            {BODY_REGIONS[r.id]?.label || r.id}
          </text>
        ))}
      </svg>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Click a body region to filter symptoms
      </p>
    </div>
  )
}
