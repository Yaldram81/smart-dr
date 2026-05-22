'use client'

export function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2" aria-hidden="true">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/20" />
      <div className="mx-3 flex gap-1">
        <div className="size-1 rounded-full bg-primary/30" />
        <div className="size-1.5 rounded-full bg-primary/50" />
        <div className="size-1 rounded-full bg-primary/30" />
      </div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/20" />
    </div>
  )
}
