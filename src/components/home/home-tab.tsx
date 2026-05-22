'use client'

import { HeroSection } from '@/components/home/hero-section'
import { StatsBar } from '@/components/home/stats-bar'
import { HealthTipWidget } from '@/components/home/health-tip-widget'
import { EmergencyQuickActions } from '@/components/home/emergency-quick-actions'
import { HowItWorksSection } from '@/components/home/how-it-works-section'
import { FeaturesSection } from '@/components/home/features-section'
import { DiseaseBrowserSection } from '@/components/home/disease-browser-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { FAQSection } from '@/components/home/faq-section'
import { AboutSection } from '@/components/home/about-section'
import { ContactSection } from '@/components/home/contact-section'
import { CTASection } from '@/components/home/cta-section'
import { BlogSection } from '@/components/home/blog-section'
import { DeveloperSection } from '@/components/home/developer-section'
import { SectionDivider } from '@/components/layout/section-divider'

export default function HomeTab() {
  return (
    <div>
      <HeroSection />
      <SectionDivider />
      <StatsBar />
      <HealthTipWidget />
      <EmergencyQuickActions />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <FeaturesSection />
      <SectionDivider />
      <DiseaseBrowserSection />
      <SectionDivider />
      <TestimonialsSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <FAQSection />
      <SectionDivider />
      <BlogSection />
      <SectionDivider />
      <DeveloperSection />
      <SectionDivider />
      <ContactSection />
      <SectionDivider />
      <CTASection />
    </div>
  )
}
