'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import {
  Wind, Brain, HeartPulse, Apple, Stethoscope, ChevronRight
} from 'lucide-react'

const BLOG_ARTICLES = [
  {
    id: 1,
    title: 'Understanding Seasonal Allergies',
    category: 'Respiratory',
    excerpt: 'Learn about managing seasonal allergies, common triggers, and when to seek professional help for your symptoms.',
    author: 'Dr. Ayesha Siddiqui',
    date: 'Feb 20, 2025',
    gradient: 'from-emerald-400 to-teal-500',
    icon: <Wind className="size-8" />,
    content: `Seasonal allergies, also known as hay fever or allergic rhinitis, affect millions of people worldwide. They occur when your immune system overreacts to airborne substances like pollen, mold spores, or dust mites.

**Common Triggers:**
- Tree pollen (spring)
- Grass pollen (summer)
- Ragweed pollen (fall)
- Mold spores (year-round)
- Dust mites (year-round)

**Symptoms to Watch For:**
- Sneezing and runny or stuffy nose
- Itchy or watery eyes
- Itchy throat or ears
- Fatigue and irritability
- Dark circles under the eyes

**Management Tips:**
1. Monitor pollen counts in your area
2. Keep windows closed during high-pollen days
3. Use HEPA air purifiers indoors
4. Shower after outdoor activities
5. Consider over-the-counter antihistamines

**When to See a Doctor:**
If your symptoms are severe, persist despite over-the-counter medications, or significantly impact your daily life, consult an allergist. They can perform allergy testing and develop a personalized treatment plan, which may include immunotherapy.`
  },
  {
    id: 2,
    title: 'The Rise of Telemedicine',
    category: 'Technology',
    excerpt: 'How AI and telemedicine are transforming healthcare access, making medical consultation more convenient than ever.',
    author: 'Prof. Hassan Raza',
    date: 'Feb 15, 2025',
    gradient: 'from-blue-400 to-indigo-500',
    icon: <Brain className="size-8" />,
    content: `Telemedicine has revolutionized healthcare delivery, especially since the global pandemic accelerated its adoption. Combined with AI, it's transforming how patients access medical care.

**The Growth of Telemedicine:**
- Global telemedicine market expected to reach $185 billion by 2026
- Over 80% of patients report satisfaction with virtual visits
- 76% of hospitals now offer telehealth services

**AI-Powered Healthcare:**
1. Symptom checking and triage systems
2. AI-assisted diagnosis from medical imaging
3. Predictive analytics for patient outcomes
4. Chatbot-based health consultations
5. Remote patient monitoring with IoT devices

**Benefits of Telemedicine:**
- Reduced travel time and costs
- Access to specialists regardless of location
- Shorter wait times
- Better chronic disease management
- Improved mental health access

**Challenges to Address:**
- Data privacy and security concerns
- Digital divide and technology access
- Insurance coverage gaps
- Maintaining quality of care

The future of healthcare lies in the seamless integration of AI tools like Smart.Dr with traditional medical practice, creating a hybrid model that maximizes accessibility without compromising quality.`
  },
  {
    id: 3,
    title: 'Heart Health: Warning Signs',
    category: 'Cardiovascular',
    excerpt: 'Key symptoms of heart problems you shouldn\'t ignore. Early detection can save your life.',
    author: 'Dr. Farhan Ahmed',
    date: 'Feb 10, 2025',
    gradient: 'from-rose-400 to-red-500',
    icon: <HeartPulse className="size-8" />,
    content: `Cardiovascular disease remains the leading cause of death globally. Knowing the warning signs can help you seek timely medical attention and potentially save your life.

**Critical Warning Signs:**
- Chest pain or discomfort (angina)
- Shortness of breath
- Pain radiating to arm, jaw, or back
- Irregular heartbeat (arrhythmia)
- Unexplained fatigue
- Swelling in legs, ankles, or feet
- Dizziness or lightheadedness

**Risk Factors:**
1. High blood pressure
2. High cholesterol
3. Smoking
4. Diabetes
5. Obesity
6. Family history
7. Sedentary lifestyle

**Prevention Strategies:**
- Exercise regularly (150 min/week moderate activity)
- Maintain a heart-healthy diet (Mediterranean diet)
- Quit smoking
- Manage stress
- Monitor blood pressure and cholesterol
- Get adequate sleep (7-9 hours)

**Emergency Action:**
If you experience severe chest pain, sudden shortness of breath, or fainting, call emergency services immediately. Every minute matters during a cardiac event. Do not attempt to drive yourself to the hospital.`
  },
  {
    id: 4,
    title: 'Mental Health in the Digital Age',
    category: 'Psychology',
    excerpt: 'Managing screen time, digital wellness, and protecting your mental health in an always-connected world.',
    author: 'Dr. Zainab Khan',
    date: 'Feb 5, 2025',
    gradient: 'from-violet-400 to-purple-500',
    icon: <Brain className="size-8" />,
    content: `The digital age has brought unprecedented connectivity, but it has also introduced new challenges for mental health. Understanding the impact of technology on our wellbeing is crucial.

**Digital Mental Health Impacts:**
- Increased anxiety and depression rates
- Social media comparison and FOMO
- Sleep disruption from blue light
- Attention span reduction
- Cyberbullying and online harassment
- Information overload

**Signs of Digital Fatigue:**
1. Eye strain and headaches
2. Difficulty sleeping
3. Feeling overwhelmed by notifications
4. Reduced attention span
5. Irritability when away from devices
6. Neglecting real-world relationships

**Digital Wellness Strategies:**
- Set screen time limits (2+ hour-free zones)
- Practice the 20-20-20 rule for eye health
- Enable night mode/blue light filters
- Schedule digital detox periods
- Use mindfulness and meditation apps
- Prioritize face-to-face interactions
- Create tech-free bedrooms

**When to Seek Help:**
If you experience persistent sadness, anxiety, or social withdrawal related to digital use, consider speaking with a mental health professional. Online therapy platforms have made mental health support more accessible than ever.`
  },
  {
    id: 5,
    title: 'Nutrition and Immunity',
    category: 'General',
    excerpt: 'Foods that boost your immune system naturally. A guide to eating your way to better health.',
    author: 'Dr. Nadia Bukhari',
    date: 'Jan 30, 2025',
    gradient: 'from-amber-400 to-orange-500',
    icon: <Apple className="size-8" />,
    content: `A strong immune system is your body's best defense against illness. The food you eat plays a vital role in supporting immune function.

**Top Immune-Boosting Nutrients:**
- **Vitamin C**: Citrus fruits, bell peppers, strawberries, broccoli
- **Vitamin D**: Fatty fish, fortified foods, sunlight exposure
- **Zinc**: Lean meats, legumes, seeds, nuts
- **Selenium**: Brazil nuts, seafood, whole grains
- **Probiotics**: Yogurt, kefir, sauerkraut, kimchi
- **Antioxidants**: Berries, dark chocolate, leafy greens

**Immune-Strengthening Foods:**
1. Garlic — contains allicin with antimicrobial properties
2. Ginger — anti-inflammatory and antioxidant
3. Turmeric — curcumin boosts immune cell activity
4. Green tea — rich in EGCG catechin
5. Almonds — vitamin E for healthy immune cells
6. Spinach — packed with vitamins A, C, and folate
7. Yogurt — probiotics support gut immunity

**Foods to Limit:**
- Excessive sugar suppresses immune function
- Processed foods increase inflammation
- Excessive alcohol impairs immune cells

**Lifestyle Tips:**
A balanced diet combined with regular exercise, adequate sleep, stress management, and hydration creates the foundation for robust immunity.`
  },
  {
    id: 6,
    title: 'When to Visit a Specialist',
    category: 'Guide',
    excerpt: 'Understanding which doctor to see for your symptoms. Navigate the healthcare system with confidence.',
    author: 'Dr. Imran Shahid',
    date: 'Jan 25, 2025',
    gradient: 'from-cyan-400 to-sky-500',
    icon: <Stethoscope className="size-8" />,
    content: `Knowing which specialist to consult can save you time, money, and ensure you receive the most appropriate care. Here's a guide to help you navigate the healthcare system.

**Common Symptoms and Their Specialists:**

**Respiratory Issues** → Pulmonologist
- Persistent cough, wheezing, shortness of breath
- Asthma management, COPD, pneumonia

**Heart Problems** → Cardiologist
- Chest pain, palpitations, high blood pressure
- Irregular heartbeat, heart disease screening

**Digestive Issues** → Gastroenterologist
- Chronic heartburn, abdominal pain, blood in stool
- IBS, Crohn's disease, liver problems

**Neurological Symptoms** → Neurologist
- Chronic headaches, seizures, numbness
- Memory problems, tremors, dizziness

**Skin Conditions** → Dermatologist
- Persistent rashes, unusual moles, acne
- Skin infections, allergic skin reactions

**Mental Health** → Psychiatrist/Psychologist
- Depression, anxiety, panic attacks
- Sleep disorders, behavioral changes

**When to Start with a General Practitioner:**
- First onset of undiagnosed symptoms
- Annual health check-ups
- Minor illnesses and injuries
- Referrals to specialists

**Tips for Your Visit:**
1. Prepare a list of symptoms and questions
2. Bring your medical history and medications
3. Be honest about lifestyle factors
4. Ask about follow-up care
5. Request test results in writing`
  },
]

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<typeof BLOG_ARTICLES[0] | null>(null)

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Health Blog</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Latest Health Insights</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Stay informed with expert articles on health, wellness, and medical technology
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BLOG_ARTICLES.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 border-border/50 hover:border-primary/20 group glass-card glass-card-hover">
                {/* Image placeholder with gradient */}
                <div className={`relative h-40 bg-gradient-to-br ${article.gradient} flex items-center justify-center`}>
                  <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
                    {article.icon}
                  </div>
                  <Badge className="absolute top-3 left-3 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                    {article.category}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </CardContent>

                <CardFooter className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="size-7 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {article.author.split(' ').slice(-1)[0][0]}{article.author.split(' ').slice(-2, -1)[0]?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{article.author}</p>
                        <p className="text-[10px] text-muted-foreground">{article.date}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary text-xs shrink-0 gap-1 px-2"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read More
                      <ChevronRight className="size-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Article Dialog */}
        <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedArticle && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{selectedArticle.category}</Badge>
                    <span className="text-xs text-muted-foreground">{selectedArticle.date}</span>
                  </div>
                  <DialogTitle className="text-xl">{selectedArticle.title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 pt-1">
                    <Avatar className="size-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                        {selectedArticle.author.split(' ').slice(-1)[0][0]}{selectedArticle.author.split(' ').slice(-2, -1)[0]?.[0] || ''}
                      </AvatarFallback>
                    </Avatar>
                    <span>By {selectedArticle.author}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
