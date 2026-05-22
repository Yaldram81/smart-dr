'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

export function FAQSection() {
  const faqs = [
    {
      question: 'How accurate are the disease predictions?',
      answer: 'Our AI system uses a weighted symptom-matching algorithm against a comprehensive database of 42+ diseases and 187+ symptoms. While the system provides helpful insights, predictions are for educational purposes only and should not replace professional medical diagnosis. Accuracy depends on the number and specificity of symptoms selected.',
    },
    {
      question: 'Is my health data secure and private?',
      answer: 'Absolutely. We take data privacy seriously. Your symptom selections and prediction results are encrypted and stored securely. We never share your personal health information with third parties. You can also delete your prediction history at any time from the dashboard.',
    },
    {
      question: 'Can this tool replace a real doctor?',
      answer: 'No. Smart.Dr is designed to be a supplementary tool for initial symptom assessment and health awareness. It cannot and should not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions.',
    },
    {
      question: 'How does the AI analysis work?',
      answer: 'Our system uses a two-step approach: First, a weighted matching algorithm compares your selected symptoms against our disease database to calculate confidence scores. Then, an LLM (Large Language Model) provides detailed analysis including specialist recommendations, health advice, and precautionary measures tailored to your symptom profile.',
    },
    {
      question: 'What symptoms are supported?',
      answer: 'We support 187+ symptoms organized across categories including General, Respiratory, Digestive, Skin, Musculoskeletal, Neurological, Cardiovascular, Endocrine, and Infectious. You can browse symptoms by category or use the body map feature for guided selection.',
    },
    {
      question: 'Is Smart.Dr free to use?',
      answer: 'Yes! The core symptom checker, disease predictions, BMI calculator, and health dashboard are completely free. Create a free account to save your prediction history and access personalized health insights.',
    },
    {
      question: 'How many symptoms should I select for best results?',
      answer: 'We recommend selecting at least 3-5 symptoms for more accurate predictions. The more specific symptoms you provide, the better the AI can narrow down potential conditions. However, selecting too many unrelated symptoms may reduce prediction accuracy.',
    },
    {
      question: 'What does the Health Assessment Score mean?',
      answer: 'The Health Assessment Score is a composite metric calculated from your BMI, activity level, and symptom patterns. It provides a general wellness indicator on a 0-100 scale. A higher score suggests better overall health patterns. This is an educational metric and not a medical diagnosis.',
    },
    {
      question: 'Can I use this for my family members?',
      answer: 'Yes, you can use the symptom checker for family members. However, each person should have their own account to maintain separate prediction histories and health profiles. This ensures more accurate and personalized health tracking over time.',
    },
    {
      question: 'What should I do if predictions show a serious condition?',
      answer: 'If our system indicates a potentially serious condition, please do not panic. The prediction is not a diagnosis. We recommend scheduling an appointment with the recommended specialist as soon as possible. For emergency symptoms like chest pain, difficulty breathing, or signs of stroke, call emergency services immediately.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.01] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Get answers to common questions about Smart.Dr
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border rounded-xl px-6 bg-card shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-md data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline py-4 gap-3">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="size-4 text-primary shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
