'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Code2, FileText, Layers, Cpu, Database, Zap, Sparkles, Brain, TrendingUp
} from 'lucide-react'

const TEAM_MEMBERS = [
  {
    name: 'Ahmed Khan',
    role: 'Lead Developer',
    bio: 'Full-stack developer with expertise in Next.js and TypeScript. Led the architecture and development of Smart.Dr from concept to deployment.',
    initials: 'AK',
    color: 'bg-emerald-500',
  },
  {
    name: 'Sara Ali',
    role: 'AI/ML Engineer',
    bio: 'Specialized in machine learning and NLP. Designed and implemented the weighted symptom-matching algorithm and LLM integration pipeline.',
    initials: 'SA',
    color: 'bg-teal-500',
  },
  {
    name: 'Usman Malik',
    role: 'UI/UX Designer',
    bio: 'Creative designer focused on healthcare interfaces. Crafted the intuitive user experience and accessible design system for Smart.Dr.',
    initials: 'UM',
    color: 'bg-amber-500',
  },
  {
    name: 'Fatima Noor',
    role: 'Backend Developer',
    bio: 'Backend specialist with experience in database design and API development. Built the robust prediction engine and data management systems.',
    initials: 'FN',
    color: 'bg-rose-500',
  },
]

const TECH_STACK = [
  { name: 'Next.js 16', icon: <Code2 className="size-4" /> },
  { name: 'TypeScript', icon: <FileText className="size-4" /> },
  { name: 'Prisma ORM', icon: <Layers className="size-4" /> },
  { name: 'SQLite', icon: <Database className="size-4" /> },
  { name: 'Tailwind CSS', icon: <Zap className="size-4" /> },
  { name: 'shadcn/ui', icon: <Layers className="size-4" /> },
  { name: 'Framer Motion', icon: <Sparkles className="size-4" /> },
  { name: 'Zustand', icon: <Cpu className="size-4" /> },
  { name: 'LLM (z-ai)', icon: <Brain className="size-4" /> },
  { name: 'Recharts', icon: <TrendingUp className="size-4" /> },
]

export function DeveloperSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Our Team</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Meet the Developers</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            The talented team behind Smart.Dr — building the future of AI-powered health analysis
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5 border-border/50 hover:border-primary/20 group glass-card glass-card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`size-14 rounded-xl ${member.color} flex items-center justify-center text-white font-bold text-lg shrink-0 group-hover:scale-105 transition-transform`}>
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-base">{member.name}</h3>
                      <Badge variant="secondary" className="mt-1 text-xs">{member.role}</Badge>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">{member.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
              Tech Stack
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Built with modern, reliable technologies</p>
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
