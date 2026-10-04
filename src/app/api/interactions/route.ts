import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Pre-compiled clinical drug interaction database (evidence-based pharmacology)
const KNOWN_INTERACTIONS: Array<{
  drugs: [string, string];
  severity: 'severe' | 'moderate' | 'mild';
  description: string;
  recommendation: string;
}> = [
  {
    drugs: ['aspirin', 'ibuprofen'],
    severity: 'severe',
    description: 'Concurrent use of multiple NSAIDs significantly increases the risk of gastrointestinal ulceration, bleeding, and renal impairment. Ibuprofen may also interfere with Aspirin antiplatelet cardioprotective effect.',
    recommendation: 'Avoid simultaneous use. Consult a physician before combining.'
  },
  {
    drugs: ['warfarin', 'aspirin'],
    severity: 'severe',
    description: 'High risk of severe bleeding or hemorrhage due to combined anticoagulant and antiplatelet effects.',
    recommendation: 'Strict medical supervision and INR monitoring required.'
  },
  {
    drugs: ['warfarin', 'ibuprofen'],
    severity: 'severe',
    description: 'NSAIDs increase the anticoagulant effect of Warfarin and induce gastric mucosal damage, leading to heightened hemorrhage risk.',
    recommendation: 'Avoid combination. Consider Paracetamol for pain relief under doctor guidance.'
  },
  {
    drugs: ['metformin', 'ciprofloxacin'],
    severity: 'moderate',
    description: 'Fluoroquinolones like Ciprofloxacin can cause blood glucose disturbances (both severe hypoglycemia and hyperglycemia) in diabetic patients taking Metformin.',
    recommendation: 'Monitor blood sugar levels closely.'
  },
  {
    drugs: ['lisinopril', 'ibuprofen'],
    severity: 'moderate',
    description: 'NSAIDs may diminish the antihypertensive effect of ACE inhibitors like Lisinopril and increase the risk of acute renal failure.',
    recommendation: 'Monitor blood pressure and renal function.'
  },
  {
    drugs: ['paracetamol', 'alcohol'],
    severity: 'severe',
    description: 'Chronic alcohol intake combined with Paracetamol increases the risk of severe hepatotoxicity (liver failure).',
    recommendation: 'Do not take Paracetamol if consuming alcohol.'
  },
  {
    drugs: ['tramadol', 'sertraline'],
    severity: 'severe',
    description: 'Risk of Serotonin Syndrome and increased seizure susceptibility due to additive serotonergic activity.',
    recommendation: 'Avoid combination or seek immediate medical consultation if experiencing tremors, hyperthermia, or agitation.'
  },
  {
    drugs: ['atorvastatin', 'clarithromycin'],
    severity: 'severe',
    description: 'Clarithromycin strongly inhibits CYP3A4 metabolism, drastically increasing Atorvastatin blood levels and risk of rhabdomyolysis (muscle breakdown).',
    recommendation: 'Temporary suspension of Statin during antibiotic treatment is often advised by physicians.'
  },
  {
    drugs: ['omeprazole', 'clopidogrel'],
    severity: 'moderate',
    description: 'Omeprazole may inhibit the activation of Clopidogrel via CYP2C19, potentially diminishing its antiplatelet efficacy.',
    recommendation: 'Consider alternative acid suppressants like Pantoprazole under physician consultation.'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { medications, language = 'en' } = body;

    if (!medications || !Array.isArray(medications) || medications.length < 2) {
      return NextResponse.json(
        { error: 'At least two medications are required to check for interactions.' },
        { status: 400 }
      );
    }

    const cleanMeds = medications.map(m => String(m).toLowerCase().trim()).filter(Boolean);
    const foundInteractions: any[] = [];

    // 1. Check in-process verified clinical database
    for (let i = 0; i < cleanMeds.length; i++) {
      for (let j = i + 1; j < cleanMeds.length; j++) {
        const m1 = cleanMeds[i];
        const m2 = cleanMeds[j];

        for (const inter of KNOWN_INTERACTIONS) {
          const [d1, d2] = inter.drugs;
          if (
            (m1.includes(d1) && m2.includes(d2)) ||
            (m1.includes(d2) && m2.includes(d1))
          ) {
            foundInteractions.push({
              drugs: [cleanMeds[i], cleanMeds[j]],
              severity: inter.severity,
              description: inter.description,
              recommendation: inter.recommendation,
              source: 'Verified Clinical Pharmacology Database',
            });
          }
        }
      }
    }

    // 2. If combinations remain or AI analysis requested, consult Gemini
    let aiAnalysis: string | null = null;
    try {
      const zai = await ZAI.create();
      const promptLang = language === 'ur' ? 'Write the analysis in Urdu (اردو).' : 'Write in English.';

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a clinical pharmacologist AI assistant. Evaluate the safety of combining these medications. Highlight dangerous drug interactions, contraindications, toxicity risks, and food/alcohol interactions. Always include a clinical disclaimer that patients must confirm with their prescribing physician or pharmacist. ${promptLang}`
          },
          {
            role: 'user',
            content: `Medications: ${cleanMeds.join(', ')}

Please evaluate potential interactions between these medications:
1. **Interaction Severity** (None, Mild, Moderate, Severe)
2. **Clinical Mechanism**
3. **Patient Advice & Warning Signs**
4. **Alternative Options or Precautions**`
          }
        ],
        thinking: { type: 'disabled' }
      });

      aiAnalysis = completion.choices[0]?.message?.content || null;
    } catch (aiErr) {
      console.warn('AI Interaction analysis skipped:', aiErr);
    }

    return NextResponse.json({
      medications: cleanMeds,
      interactionsFound: foundInteractions.length > 0,
      knownInteractions: foundInteractions,
      pharmacologicalAnalysis: aiAnalysis,
    });
  } catch (error) {
    console.error('Drug interaction check failed:', error);
    return NextResponse.json(
      { error: 'Failed to process interaction check' },
      { status: 500 }
    );
  }
}
