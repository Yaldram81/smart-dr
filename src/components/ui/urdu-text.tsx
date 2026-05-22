'use client'

import React from 'react'
import { isUrduText, type Language } from '@/lib/urdu-translations'

/**
 * UrduText — Wraps text content and applies Jameel Noori Nastaleeq font
 * when Urdu characters are detected. Layout remains LTR.
 *
 * NOTE: With the unicode-range @font-face approach in globals.css,
 * Jameel Noori Nastaleeq is automatically applied to ALL Urdu/Arabic
 * characters site-wide. This component is only needed for explicit
 * line-height adjustments.
 */
interface UrduTextProps {
  children: React.ReactNode
  /** If true, renders as inline span; otherwise as block div */
  inline?: boolean
  /** Additional CSS classes */
  className?: string
}

export function UrduText({ children, inline = true, className = '' }: UrduTextProps) {
  const Tag = inline ? 'span' : 'div'

  if (typeof children !== 'string') {
    return <Tag className={`urdu-inline ${className}`.trim()}>{children}</Tag>
  }

  if (isUrduText(children)) {
    return (
      <Tag className={`urdu-inline ${className}`.trim()}>
        {children}
      </Tag>
    )
  }

  return <Tag className={className}>{children}</Tag>
}

/**
 * DisplayName — Renders a display name based on language preference
 * with proper Urdu font. Layout remains LTR.
 *
 * @example
 * <DisplayName english="Fever" urdu="بخار" language="both" />
 */
interface DisplayNameProps {
  english: string
  urdu: string
  language: Language
  className?: string
  as?: 'span' | 'div' | 'p'
}

export function DisplayName({ english, urdu, language, className = '', as = 'span' }: DisplayNameProps) {
  const Tag = as

  switch (language) {
    case 'en':
      return <Tag className={className}>{english}</Tag>

    case 'ur':
      return <Tag className={`urdu-inline ${className}`.trim()}>{urdu}</Tag>

    case 'both':
      return (
        <Tag className={className}>
          {english} (<span className="urdu-inline">{urdu}</span>)
        </Tag>
      )

    default:
      return <Tag className={className}>{english}</Tag>
  }
}
