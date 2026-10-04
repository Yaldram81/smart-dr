'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { DownloadProjectButton } from '@/components/layout/download-project-button'
import {
  HeartPulse, Github, Linkedin, Mail,
  MapPin, Clock, Zap, ChevronRight, AlertTriangle, Shield,
  Stethoscope, BarChart3, MessageSquare, Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const { privacyMode, user } = useAppStore()

  const quickLinks = [
    { label: 'Home', href: '/', icon: <HeartPulse className="size-3.5" /> },
    { label: 'Symptom Checker', href: '/checker', icon: <Stethoscope className="size-3.5" /> },
    { label: 'Disease Directory', href: '/#diseases', icon: <ChevronRight className="size-3.5" /> },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="size-3.5" /> }] : []),
  ]

  const resourceLinks = [
    { label: 'Health Insights & Articles', href: '/#insights', icon: <Zap className="size-3.5" /> },
    { label: 'Frequently Asked Questions', href: '/#faq', icon: <ChevronRight className="size-3.5" /> },
    { label: 'About & Developer', href: '/#about', icon: <ChevronRight className="size-3.5" /> },
  ]

  const socialLinks = [
    { icon: <Github className="size-4" />, href: 'https://github.com/Yaldram81', label: 'GitHub' },
    { icon: <Linkedin className="size-4" />, href: 'https://www.linkedin.com/in/tanzeel-ur-rahman-71b7b2225/', label: 'LinkedIn' },
    { icon: <Mail className="size-4" />, href: 'mailto:tanzeelyaldram3@gmail.com', label: 'Email' },
  ]

  return (
    <footer className="border-t bg-muted/30 mt-auto relative">
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20" />

      <div className="container mx-auto px-4 md:px-6 pt-12 pb-8">
        {/* Main footer grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand & Social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground shadow-md">
                <HeartPulse className="size-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">Smart.Dr</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              AI-powered symptom analysis for informed health decisions. Trusted by patients and healthcare professionals worldwide.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
                  asChild
                >
                  <a href={social.href} target={social.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" aria-label={social.label}>
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Quick Links
            </h4>
            <div className="space-y-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                  <span>{link.label}</span>
                  <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Stethoscope className="size-4 text-primary" />
              Resources
            </h4>
            <div className="space-y-2.5">
              {resourceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                  <span>{link.label}</span>
                  <ChevronRight className="size-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                href="mailto:tanzeelyaldram3@gmail.com"
                className="flex items-center gap-2.5 hover:text-primary transition-colors group"
              >
                <Mail className="size-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                <span>tanzeelyaldram3@gmail.com</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 opacity-60" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0 opacity-60" />
                <span>Health Tech Hub, San Francisco</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 opacity-60" />
                <span>24/7 AI Support Available</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Smart.Dr — All rights reserved.
            </p>
            <DownloadProjectButton />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-400 font-medium">For educational purposes only. Always consult a healthcare professional.</span>
            </div>
            {privacyMode && (
              <div className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg px-3 py-2">
                <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Privacy Mode: ON — Zero data storage</span>
              </div>
            )}
          </div>
        </div>

        {/* Developer credits */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground/60">
            Developed with ❤️ by <span className="font-medium text-muted-foreground/80">Tanzeel Ur Rahman</span> — Final Year Project, BCS 8th Semester
          </p>
        </div>
      </div>
    </footer>
  )
}
