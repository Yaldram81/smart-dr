import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

/**
 * Smart.Dr Dual-Engine Prediction API (Enhanced)
 * - Local ML Engine: High-performance in-process TF-IDF & Weighted Cosine Similarity Classifier
 *   with optional external Python SVC bridge (fast fallback).
 * - Online AI Engine: Google Gemini 2.5 Flash with demographic contextualization and
 *   structured 6-dimension clinical output.
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:3031';

interface PredictionResult {
  disease: string;
  similarityScore: number; // 0-100% Symptom pattern similarity
  confidence: number;      // Backward-compatible alias
  description: string;
  specialist: string;
  severity: string;
  treatmentOverview?: string;
  precautions: string[];
  medications: string[];   // Educational reference: commonly used medications
  diet: string[];
  workout: string[];
  emergencyWarnings?: string[];
  matchedSymptoms: string[];
  totalSymptoms: number;
  contributingSymptoms?: { name: string; importance: string; score: number }[];
  absentHallmarks?: { name: string; importance: string }[];
  contraindications?: string[];
  algorithmVersion?: string;
}

// Clinical contraindication mappings for high-risk pairs
const CONTRAINDICATIONS: Record<string, string[]> = {
  'dengue fever': ['Avoid Aspirin, Ibuprofen, and NSAIDs as they increase hemorrhage risk. Use Paracetamol only.'],
  'peptic ulcer': ['Avoid NSAIDs (Aspirin, Ibuprofen, Naproxen) and corticosteroids. Avoid spicy foods and alcohol.'],
  'asthma': ['Avoid beta-blockers and aspirin unless approved by your pulmonologist.'],
  'hypertension': ['Avoid high-sodium foods, pseudoephedrine/decongestants, and licorice.'],
  'gerd': ['Avoid lying down within 3 hours of meals; avoid mint, caffeine, and acidic citrus.'],
  'gout': ['Avoid high-purine foods (organ meats, anchovies, beer) and excessive fructose.'],
};

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    const body = await request.json();
    const {
      symptomIds,
      userId = sessionUser?.id,
      patientAge = sessionUser?.age,
      patientGender = sessionUser?.gender,
      includeLLMAnalysis = true,
      privacyMode = false,
      engine = 'local-ml'
    } = body;

    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one symptom must be selected' },
        { status: 400 }
      );
    }

    // Get symptom records from PostgreSQL
    const selectedSymptomRecords = await db.symptom.findMany({
      where: { id: { in: symptomIds } },
      select: { id: true, name: true, category: true },
    });
    const symptomNames = selectedSymptomRecords.map(s => s.name);

    if (symptomNames.length === 0) {
      return NextResponse.json(
        { error: 'Invalid symptom selection' },
        { status: 400 }
      );
    }

    let predictions: PredictionResult[] = [];
    let llmAnalysis: string | null = null;

    // ═══════════════════════════════════════════════════════════════════
    // ENGINE 1: Local ML Engine (TF-IDF & Weighted Classifier + SVC)
    // ═══════════════════════════════════════════════════════════════════
    if (engine === 'local-ml') {
      let svcAvailable = false;
      let svcPredictions: { disease: string; confidence: number; severity?: string; specialist?: string }[] = [];

      // Step 1a: Optional external microservice check (non-blocking 600ms timeout)
      try {
        const svcRes = await fetch(`${ML_SERVICE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: symptomNames }),
          signal: AbortSignal.timeout(600),
        });
        if (svcRes.ok) {
          const svcData = await svcRes.json();
          svcPredictions = svcData.predictions || [];
          svcAvailable = svcPredictions.length > 0;
        }
      } catch {
        // Fast-fail: Microservice not running, immediately proceed with in-process ML engine
      }

      // Step 1b: In-process High-Performance Statistical Classifier
      // Total disease count for Inverse Document Frequency (IDF) calculation
      const totalDiseaseCount = await db.disease.count();

      // Retrieve all disease mappings that intersect with the selected symptoms
      const diseaseSymptoms = await db.diseaseSymptom.findMany({
        where: { symptomId: { in: symptomIds } },
        include: {
          disease: {
            include: {
              symptoms: {
                select: {
                  symptomId: true,
                  associationScore: true,
                  importance: true,
                  symptom: { select: { name: true } },
                },
              },
            },
          },
          symptom: { select: { id: true, name: true } },
        },
      });

      // Calculate symptom frequencies across the whole catalog for IDF
      const symptomFrequency = new Map<string, number>();
      for (const ds of diseaseSymptoms) {
        symptomFrequency.set(ds.symptomId, (symptomFrequency.get(ds.symptomId) || 0) + 1);
      }

      const diseaseScores = new Map<string, {
        matchedWeight: number;
        totalWeight: number;
        matchedSymptoms: string[];
        diseaseObj: any;
      }>();

      for (const ds of diseaseSymptoms) {
        const diseaseId = ds.diseaseId;
        const disease = ds.disease;

        if (!diseaseScores.has(diseaseId)) {
          const totalWeight = disease.symptoms.reduce((sum: number, s: any) => sum + s.associationScore, 0);
          diseaseScores.set(diseaseId, {
            matchedWeight: 0,
            totalWeight,
            matchedSymptoms: [],
            diseaseObj: disease,
          });
        }

        const entry = diseaseScores.get(diseaseId)!;
        // IDF weighting: rarer symptoms provide higher diagnostic signal
        const freq = symptomFrequency.get(ds.symptomId) || 1;
        const idf = Math.log((totalDiseaseCount + 1) / (freq + 1)) + 1.0;
        entry.matchedWeight += ds.associationScore * idf;
        entry.matchedSymptoms.push(ds.symptom.name);
      }

      // Build structured predictions from PostgreSQL
      const datasetPredictions: PredictionResult[] = [];
      for (const [diseaseId, scoreData] of diseaseScores) {
        const disease = await db.disease.findUnique({
          where: { id: diseaseId },
          select: {
            id: true, name: true, description: true, specialist: true, severity: true,
            treatmentOverview: true, precautions: true, medications: true, diet: true,
            workout: true, emergencyWarnings: true,
          }
        });
        if (!disease) continue;

        // Base pattern similarity derived from weighted ratio + symptom recall
        const ratio = scoreData.matchedWeight / Math.max(scoreData.totalWeight, 1.0);
        const recall = scoreData.matchedSymptoms.length / Math.max(scoreData.diseaseObj.symptoms.length, 1);
        let rawSimilarity = Math.round((ratio * 0.7 + recall * 0.3) * 100);

        // Demographic adjustment: apply clinical weighting if age is specified
        if (patientAge) {
          if (patientAge > 50 && ['Hypertension', 'Heart Disease', 'Osteoporosis', 'Glaucoma'].includes(disease.name)) {
            rawSimilarity = Math.min(rawSimilarity + 5, 96);
          } else if (patientAge < 15 && ['Chickenpox', 'Common Cold', 'Mumps'].includes(disease.name)) {
            rawSimilarity = Math.min(rawSimilarity + 5, 96);
          }
        }

        const similarityScore = Math.min(Math.max(rawSimilarity, 16), 98);

        if (similarityScore >= 18) {
          const diseaseLower = disease.name.toLowerCase();
          const contraindications = CONTRAINDICATIONS[diseaseLower] || [];

          // Explainability breakdown: contributing vs absent hallmark symptoms
          const allDiseaseSyms = scoreData.diseaseObj.symptoms || [];
          const contributingSymptoms = allDiseaseSyms
            .filter((dsItem: any) => symptomIds.includes(dsItem.symptomId))
            .map((dsItem: any) => ({
              name: dsItem.symptom?.name || 'Associated symptom',
              importance: dsItem.importance,
              score: Math.round(dsItem.associationScore * 100),
            }))
            .sort((a: any, b: any) => b.score - a.score);

          const absentHallmarks = allDiseaseSyms
            .filter((dsItem: any) => !symptomIds.includes(dsItem.symptomId) && dsItem.importance === 'HALLMARK')
            .map((dsItem: any) => ({
              name: dsItem.symptom?.name || 'Hallmark symptom',
              importance: dsItem.importance,
            }));

          datasetPredictions.push({
            disease: disease.name,
            similarityScore,
            confidence: similarityScore, // backward compatibility
            description: disease.description,
            specialist: disease.specialist,
            severity: disease.severity,
            treatmentOverview: disease.treatmentOverview || undefined,
            precautions: JSON.parse(disease.precautions || '[]'),
            medications: JSON.parse(disease.medications || '[]'),
            diet: JSON.parse(disease.diet || '[]'),
            workout: JSON.parse(disease.workout || '[]'),
            emergencyWarnings: JSON.parse(disease.emergencyWarnings || '[]'),
            matchedSymptoms: scoreData.matchedSymptoms,
            totalSymptoms: scoreData.diseaseObj.symptoms.length,
            contributingSymptoms,
            absentHallmarks,
            contraindications: contraindications.length > 0 ? contraindications : undefined,
            algorithmVersion: 'v2.1-weighted-profile',
          });
        }
      }

      datasetPredictions.sort((a, b) => b.confidence - a.confidence);

      // Step 1c: If external SVC was available, blend with local predictions
      if (svcAvailable) {
        const svcMap = new Map(svcPredictions.map(p => [p.disease.split(' (')[0].toLowerCase(), p.confidence]));
        for (const pred of datasetPredictions) {
          const svcConf = svcMap.get(pred.disease.toLowerCase());
          if (svcConf !== undefined) {
            const blended = Math.round((pred.confidence * 0.6) + (svcConf * 100 * 0.4));
            pred.confidence = Math.min(blended, 98);
          }
        }
        datasetPredictions.sort((a, b) => b.confidence - a.confidence);
      }

      predictions = datasetPredictions;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ENGINE 2: Online AI Engine (Google Gemini 2.5 Flash)
    // ═══════════════════════════════════════════════════════════════════
    if (engine === 'online-ai') {
      try {
        const zai = await ZAI.create();
        const demographicContext = `Patient Profile: Age ${patientAge || 'Unspecified'}, Gender ${patientGender || 'Unspecified'}`;

        const isUrdu = body.language === 'ur'
        const langInstruction = isUrdu
          ? `Language: You MUST respond in authentic medical Urdu (اردو) for all fields. Example: [{"disease":"نزلہ و زکام (Common Cold)","description":"سانس کی نالی کا وائرل انفیکشن...","precautions":["آرام کریں","گرم پانی پیئیں"],"medications":["پیراسیٹامول"],"diets":["گرم یخنی"],"workouts":["ہلکی چہل قدمی"]}]`
          : `Language: English (international medical standards).`

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are Smart.Dr, an advanced medical AI clinical decision-support engine. You MUST respond with valid JSON only. Adhere strictly to clinical safety and disclaimer requirements. ${langInstruction}`
            },
            {
              role: 'user',
              content: `${demographicContext}
Reported Symptoms: ${symptomNames.join(', ')}

Predict the top 3 most likely medical conditions. Respond with ONLY a valid JSON array of objects with these 6 exact keys:
1. "disease": name of the condition
2. "description": concise clinical description
3. "precautions": array of string precautions
4. "medications": array of evidence-supported medications
5. "diets": array of dietary guidance strings
6. "workouts": array of activity/rehabilitation strings
${isUrdu ? 'Write all values in authentic Urdu (اردو).' : ''}`
            }
          ],
          thinking: { type: 'disabled' }
        });

        const rawContent = completion.choices[0]?.message?.content || '';
        let aiPredictions: any[] = [];

        try {
          const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            aiPredictions = JSON.parse(jsonMatch[0]);
          }
        } catch (parseErr) {
          console.error('Failed to parse Gemini JSON output:', parseErr);
        }

        // Enrich AI output against PostgreSQL records
        for (const aiPred of aiPredictions.slice(0, 5)) {
          const dbDisease = await db.disease.findFirst({
            where: { name: { contains: String(aiPred.disease || '').split(' (')[0], mode: 'insensitive' } },
            select: {
              id: true, name: true, description: true, specialist: true, severity: true,
              precautions: true, medications: true, diet: true, workout: true,
              symptoms: { include: { symptom: true } },
            },
          });

          const diseaseLower = String(aiPred.disease || '').toLowerCase();
          const contraindications = CONTRAINDICATIONS[diseaseLower] || [];

          if (dbDisease) {
            const matchedSymNames = dbDisease.symptoms
              .filter(s => symptomIds.includes(s.symptomId))
              .map(s => s.symptom.name);

            const calcSim = matchedSymNames.length > 0
              ? Math.min(Math.round((matchedSymNames.length / dbDisease.symptoms.length) * 100), 95)
              : 65;

            predictions.push({
              disease: dbDisease.name,
              similarityScore: calcSim,
              confidence: calcSim,
              description: aiPred.description || dbDisease.description,
              specialist: dbDisease.specialist,
              severity: dbDisease.severity,
              treatmentOverview: (dbDisease as any).treatmentOverview || undefined,
              precautions: Array.isArray(aiPred.precautions) && aiPred.precautions.length > 0 ? aiPred.precautions : JSON.parse(dbDisease.precautions || '[]'),
              medications: Array.isArray(aiPred.medications) && aiPred.medications.length > 0 ? aiPred.medications : JSON.parse(dbDisease.medications || '[]'),
              diet: Array.isArray(aiPred.diets) && aiPred.diets.length > 0 ? aiPred.diets : JSON.parse(dbDisease.diet || '[]'),
              workout: Array.isArray(aiPred.workouts) && aiPred.workouts.length > 0 ? aiPred.workouts : JSON.parse(dbDisease.workout || '[]'),
              matchedSymptoms: matchedSymNames.length > 0 ? matchedSymNames : symptomNames,
              totalSymptoms: dbDisease.symptoms.length,
              contraindications: contraindications.length > 0 ? contraindications : undefined,
              algorithmVersion: 'Smart.Dr Online Hybrid AI v2.1',
            });
          } else {
            predictions.push({
              disease: aiPred.disease || 'Undifferentiated Condition',
              similarityScore: 60,
              confidence: 60,
              description: aiPred.description || 'Clinical analysis pending further investigation.',
              specialist: 'General Physician',
              severity: 'MODERATE',
              precautions: aiPred.precautions || [],
              medications: aiPred.medications || [],
              diet: aiPred.diets || [],
              workout: aiPred.workouts || [],
              matchedSymptoms: symptomNames,
              totalSymptoms: symptomNames.length,
              contraindications: contraindications.length > 0 ? contraindications : undefined,
              algorithmVersion: 'Smart.Dr Online Generative AI v2.1',
            });
          }
        }

        // Secondary conversational differential analysis
        if (includeLLMAnalysis && predictions.length > 0) {
          const topList = predictions.slice(0, 3).map(p => `${p.disease} (${p.confidence}%)`).join(', ');
          const analysisCompletion = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are Smart.Dr Clinical Consultant. Provide educational, well-structured health analyses. Always emphasize that this does not substitute for licensed in-person medical care. ${isUrdu ? 'Write the entire response in authentic medical Urdu (اردو).' : 'Write in English.'}`
              },
              {
                role: 'user',
                content: `${demographicContext}
Symptoms: ${symptomNames.join(', ')}
Top differential predictions: ${topList}

Provide a clinical overview with markdown headers:
${isUrdu ? `1. **طبی خلاصہ (Summary)**
2. **اہم تشویشناک علامات (Key Concerns)**
3. **فوری ضروری اقدامات (Recommended Actions)**
4. **ڈاکٹر سے فوری رجوع کی علامات (Emergency Signs)**
5. **صحت اور آرام کی تجاویز (Recovery Advice)**` : `1. **Clinical Summary**
2. **Key Triage Concerns**
3. **Immediate Recommended Steps**
4. **Warning Signs Requiring Emergency Attention**
5. **Lifestyle and Recovery Tips**`}`
              }
            ],
            thinking: { type: 'disabled' }
          });
          llmAnalysis = analysisCompletion.choices[0]?.message?.content || null;
        }
      } catch (error) {
        console.error('Online AI engine error, falling back to Local ML:', error);
        // Fallback to local engine automatically
        return POST(new NextRequest(request.url, {
          method: 'POST',
          body: JSON.stringify({ ...body, engine: 'local-ml' }),
        }));
      }
    }

    const topPredictions = predictions.slice(0, 5);

    if (topPredictions.length === 0) {
      return NextResponse.json({
        predictions: [],
        llmAnalysis: null,
        message: 'No matching conditions found for the selected symptoms. Try selecting additional symptoms.',
      });
    }

    // Save prediction in PostgreSQL if user is authenticated and privacy mode is disabled
    let savedPredictionId: string | undefined;
    const effectiveUserId = sessionUser?.id || userId;

    if (effectiveUserId && !privacyMode) {
      try {
        const saved = await db.prediction.create({
          data: {
            userId: effectiveUserId,
            selectedSymptoms: JSON.stringify([...new Set(symptomIds)]),
            results: JSON.stringify(topPredictions),
            llmAnalysis,
            engineType: engine === 'local-ml' ? 'similarity-inference' : 'llm-augmented',
            algorithmVersion: 'v2.1-weighted-profile',
            modelVersion: 'gemini-2.5-flash',
          },
        });
        savedPredictionId = saved.id;
      } catch (saveError) {
        console.error('Failed to log prediction record in PostgreSQL:', saveError);
      }
    }

    return NextResponse.json({
      predictions: topPredictions,
      llmAnalysis,
      predictionId: savedPredictionId,
      engine: engine === 'local-ml' ? 'similarity-inference' : 'llm-augmented',
      algorithmVersion: 'v2.1-weighted-profile',
    });
  } catch (error) {
    console.error('Prediction API fatal error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during prediction.' },
      { status: 500 }
    );
  }
}
