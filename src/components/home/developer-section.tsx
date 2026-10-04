'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Code2, FileText, Layers, Cpu, Database, Zap, Sparkles, Brain, TrendingUp,
  Github, Linkedin, Mail, CheckCircle2, ShieldCheck, Terminal, Award
} from 'lucide-react'

const DEVELOPER_PROFILE = {
  name: 'Tanzeel Ur Rahman',
  role: 'Lead Developer & AI Systems Architect',
  department: 'Department of Computer Science & Information Technology',
  institution: 'University of Malakand',
  initials: 'TR',
  bio: 'Full-stack software engineer and AI systems developer. Single-handedly architected and engineered Smart.Dr from ground up — including the dual-engine diagnostic pipeline (weighted pattern similarity & Google Gemini Flash reasoning), responsive visual symptom taxonomy, PostgreSQL clinical database, and bilingual English/Urdu clinical interface.',
  highlights: [
    'Dual-Engine Diagnostic Engine Architecture (Similarity Inference & Gemini 2.5 Flash)',
    '187+ Visual & Anatomical Symptom Taxonomy with Rich Clinical Metadata',
    'Full-Stack Next.js 16 (App Router), PostgreSQL & Prisma ORM',
    'Complete English & Urdu (Jameel Noori Nastaleeq) Localization'
  ],
  socials: [
    { icon: Github, label: 'GitHub', href: 'https://github.com/Yaldram81' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/tanzeel-ur-rahman-71b7b2225/' },
    { icon: Mail, label: 'Email', href: 'mailto:tanzeelyaldram3@gmail.com' },
  ]
}

const TECH_STACK = [
  { name: 'Next.js 16', icon: <Code2 className="size-4" /> },
  { name: 'TypeScript', icon: <FileText className="size-4" /> },
  { name: 'PostgreSQL', icon: <Database className="size-4" /> },
  { name: 'Prisma ORM', icon: <Layers className="size-4" /> },
  { name: 'Tailwind CSS', icon: <Zap className="size-4" /> },
  { name: 'shadcn/ui', icon: <Layers className="size-4" /> },
  { name: 'Framer Motion', icon: <Sparkles className="size-4" /> },
  { name: 'Zustand', icon: <Cpu className="size-4" /> },
  { name: 'Gemini 2.5 AI', icon: <Brain className="size-4" /> },
  { name: 'Recharts', icon: <TrendingUp className="size-4" /> },
]

export function DeveloperSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-muted/30" id="developer">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 text-primary">
            <Terminal className="size-3" />
            Project Architect
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Lead Developer</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            The engineer behind Smart.Dr — architecting intelligent healthcare screening and dual-engine AI
          </p>
        </motion.div>

        {/* Developer Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <Card className="overflow-hidden border-border/60 hover:border-primary/30 shadow-lg transition-all glass-card">
            <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-primary" />
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                {/* Avatar / Badge */}
                <div className="relative shrink-0">
                  <div className="size-24 md:size-28 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-primary flex items-center justify-center text-white font-extrabold text-3xl shadow-md ring-4 ring-primary/10">
                    {DEVELOPER_PROFILE.initials}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-background border border-primary/20 rounded-full p-1.5 shadow-sm">
                    <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {DEVELOPER_PROFILE.name}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {DEVELOPER_PROFILE.role}
                      </p>
                    </div>
                    <Badge variant="secondary" className="self-center md:self-auto text-xs font-semibold px-3 py-1">
                      BCS — 8th Semester
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {DEVELOPER_PROFILE.institution} • {DEVELOPER_PROFILE.department}
                  </p>

                  <p className="text-sm text-muted-foreground/90 leading-relaxed pt-1">
                    {DEVELOPER_PROFILE.bio}
                  </p>

                  {/* Key Contributions */}
                  <div className="pt-3">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-center md:justify-start">
                      <Award className="size-3.5 text-primary" />
                      Core Architectural Contributions
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2 text-left">
                      {DEVELOPER_PROFILE.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-2 border border-border/40">
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social / Contact Links */}
                  <div className="flex items-center justify-center md:justify-start gap-3 pt-4 border-t border-border/50">
                    {DEVELOPER_PROFILE.socials.map((social) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-md hover:bg-primary/10"
                        >
                          <Icon className="size-3.5" />
                          <span>{social.label}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Cpu className="size-5 text-primary" />
              Engineered With Modern Technologies
            </h3>
            <p className="text-sm text-muted-foreground mt-1">High-performance tech stack utilized across Smart.Dr</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-primary/20 group cursor-default glass-card">
                  <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                    <div className="text-primary group-hover:scale-110 transition-transform">{tech.icon}</div>
                    <span className="text-xs font-medium">{tech.name}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
