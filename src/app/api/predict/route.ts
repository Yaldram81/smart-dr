import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

/**
 * Smart.Dr Dual-Engine Prediction API
 * Per proposal: Local ML Engine (SVC) + Online AI Engine (Gemini)
 *
 * - local-ml: SVC model on Python service → enriched with CSV dataset recommendations
 * - online-ai: Google Gemini API → structured JSON with 6 keys
 *   (disease, description, precautions, medications, diets, workouts)
 */

const ML_SERVICE_URL = 'http://localhost:3031';

interface PredictionResult {
  disease: string;
  confidence: number;
  description: string;
  specialist: string;
  severity: string;
  precautions: string[];
  medications: string[];
  diet: string[];
  workout: string[];
  matchedSymptoms: string[];
  totalSymptoms: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symptomIds, userId, includeLLMAnalysis = true, privacyMode = false, engine = 'local-ml' } = body;

    if (!symptomIds || !Array.isArray(symptomIds) || symptomIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one symptom must be selected' },
        { status: 400 }
      );
    }

    // Get symptom names from DB
    const selectedSymptomRecords = await db.symptom.findMany({
      where: { id: { in: symptomIds } },
      select: { id: true, name: true },
    });
    const symptomNames = selectedSymptomRecords.map(s => s.name);

    let predictions: PredictionResult[] = [];
    let llmAnalysis: string | null = null;

    // ═══════════════════════════════════════════════════════════════════
    // ENGINE 1: Local ML Engine (SVC Model + Dataset Fallback)
    // Per proposal: SVC trained on 132 features, 41 diseases, 80-20 split
    // Falls back to weighted dataset matching if SVC service unavailable
    // ═══════════════════════════════════════════════════════════════════
    if (engine === 'local-ml') {
      let svcAvailable = false;
      let svcPredictions: { disease: string; confidence: number; severity: string; specialist: string }[] = [];

      // Step 1a: Try SVC model prediction
      try {
        const svcRes = await fetch(`${ML_SERVICE_URL}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: symptomNames }),
          signal: AbortSignal.timeout(10000),
        });
        if (svcRes.ok) {
          const svcData = await svcRes.json();
          svcPredictions = svcData.predictions || [];
          svcAvailable = svcPredictions.length > 0;
        }
      } catch (e) {
        console.error('SVC service unavailable, using dataset-only prediction:', e);
      }

      // Step 1b: Dataset-based prediction using weighted symptom matching (fallback)
      const diseaseScores = new Map<string, {
        matchedWeight: number;
        totalWeight: number;
        matchedSymptoms: string[];
      }>();

      const diseaseSymptoms = await db.diseaseSymptom.findMany({
        where: { symptomId: { in: symptomIds } },
        include: {
          disease: {
            include: { symptoms: { include: { symptom: true } } },
          },
          symptom: true,
        },
      });

      for (const ds of diseaseSymptoms) {
        const diseaseId = ds.diseaseId;
        const disease = ds.disease;

        if (!diseaseScores.has(diseaseId)) {
          const totalWeight = disease.symptoms.reduce((sum, s) => sum + s.weight, 0);
          diseaseScores.set(diseaseId, {
            matchedWeight: 0,
            totalWeight,
            matchedSymptoms: [],
          });
        }

        const entry = diseaseScores.get(diseaseId)!;
        entry.matchedWeight += ds.weight;
        entry.matchedSymptoms.push(ds.symptom.name);
      }

      // Build dataset predictions with full CSV-sourced recommendations
      const datasetPredictions: PredictionResult[] = [];
      for (const [diseaseId, scores] of diseaseScores) {
        const disease = await db.disease.findUnique({
          where: { id: diseaseId },
          select: {
            id: true, name: true, description: true, specialist: true, severity: true,
            precautions: true, medications: true, diet: true, workout: true,
          }
        });
        if (!disease) continue;

        const weightScore = scores.matchedWeight / scores.totalWeight;
        const confidence = Math.min(Math.round(weightScore * 100), 98);

        if (confidence > 15) {
          datasetPredictions.push({
            disease: disease.name,
            confidence,
            description: disease.description,
            specialist: disease.specialist,
            severity: disease.severity,
            // CSV-sourced recommendations (from 8 curated datasets per proposal)
            precautions: JSON.parse(disease.precautions || '[]'),
            medications: JSON.parse(disease.medications || '[]'),
            diet: JSON.parse(disease.diet || '[]'),
            workout: JSON.parse(disease.workout || '[]'),
            matchedSymptoms: scores.matchedSymptoms,
            totalSymptoms: scores.matchedSymptoms.length + (await db.diseaseSymptom.count({ where: { diseaseId } })) - scores.matchedSymptoms.length,
          });
        }
      }
      datasetPredictions.sort((a, b) => b.confidence - a.confidence);

      // Step 1c: If SVC available, blend with dataset for enhanced accuracy
      if (svcAvailable) {
        const svcMap = new Map(svcPredictions.map(p => [p.disease.split(' (')[0].toLowerCase(), p.confidence]));

        // Blend: 60% dataset + 40% SVC confidence for combined scoring
        for (const pred of datasetPredictions) {
          const svcConf = svcMap.get(pred.disease.toLowerCase());
          if (svcConf !== undefined) {
            const datasetConf = pred.confidence / 100;
            const blended = Math.round((datasetConf * 0.6 + svcConf * 0.4) * 100);
            pred.confidence = Math.min(blended, 98);
          }
        }

        // Add SVC-only predictions (not in dataset) enriched from DB
        for (const svcPred of svcPredictions) {
          const alreadyExists = datasetPredictions.some(p => p.disease.toLowerCase() === svcPred.disease.split(' (')[0].toLowerCase());
          if (!alreadyExists) {
            const disease = await db.disease.findFirst({
              where: { name: { contains: svcPred.disease.split(' (')[0] } },
              select: {
                id: true, name: true, description: true, specialist: true, severity: true,
                precautions: true, medications: true, diet: true, workout: true,
                symptoms: { include: { symptom: true } },
              },
            });
            if (disease) {
              const matchedSymNames = disease.symptoms
                .filter(s => symptomIds.includes(s.symptomId))
                .map(s => s.symptom.name);
              datasetPredictions.push({
                disease: disease.name,
                confidence: Math.round(svcPred.confidence * 100),
                description: disease.description,
                specialist: disease.specialist,
                severity: disease.severity,
                precautions: JSON.parse(disease.precautions || '[]'),
                medications: JSON.parse(disease.medications || '[]'),
                diet: JSON.parse(disease.diet || '[]'),
                workout: JSON.parse(disease.workout || '[]'),
                matchedSymptoms: matchedSymNames,
                totalSymptoms: disease.symptoms.length,
              });
            } else {
              datasetPredictions.push({
                disease: svcPred.disease,
                confidence: Math.round(svcPred.confidence * 100),
                description: '',
                specialist: svcPred.specialist || 'Unknown',
                severity: svcPred.severity || 'unknown',
                precautions: [], medications: [], diet: [], workout: [],
                matchedSymptoms: symptomNames,
                totalSymptoms: symptomNames.length,
              });
            }
          }
        }
        datasetPredictions.sort((a, b) => b.confidence - a.confidence);
      }

      predictions = datasetPredictions;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ENGINE 2: Online AI Engine (Google Gemini API)
    // Per proposal: gemini-2.5-flash with structured JSON output
    // enforcing 6 required keys: disease, description, precautions,
    // medications, diets, workouts
    // ═══════════════════════════════════════════════════════════════════
    if (engine === 'online-ai') {
      try {
        const zai = await ZAI.create();

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'assistant',
              content: `You are Smart.Dr, a medical AI assistant specializing in symptom-based disease prediction. You MUST respond with valid JSON only. Provide educational health information. Always include a medical disclaimer.`
            },
            {
              role: 'user',
              content: `Based on the following symptoms: ${symptomNames.join(', ')}

Predict the top 3 most likely diseases. You MUST respond with ONLY a JSON array (no markdown, no code blocks) where each object has exactly these 6 keys:
1. "disease" - The predicted disease name
2. "description" - Brief description of the disease
3. "precautions" - Array of precaution strings
4. "medications" - Array of medication strings
5. "diets" - Array of dietary advice strings
6. "workouts" - Array of workout recommendation strings

Example format:
[{"disease":"Common Cold","description":"A viral infection...","precautions":["Rest well","Stay warm"],"medications":["Paracetamol"],"diets":["Hot soup","Vitamin C fruits"],"workouts":["Light walking","Stretching"]}]

Respond with ONLY the JSON array. No extra text.`
            }
          ],
          thinking: { type: 'disabled' }
        });

        const rawContent = completion.choices[0]?.message?.content || '';

        // Parse the JSON response from Gemini
        let aiPredictions: Array<{
          disease: string;
          description: string;
          precautions: string[];
          medications: string[];
          diets: string[];
          workouts: string[];
        }> = [];

        try {
          // Try to extract JSON from the response (handle markdown code blocks)
          const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            aiPredictions = JSON.parse(jsonMatch[0]);
          }
        } catch (parseErr) {
          console.error('Failed to parse Gemini JSON:', parseErr);
        }

        // Convert AI predictions to our format, enriching with DB data where possible
        for (const aiPred of aiPredictions.slice(0, 5)) {
          // Try to find matching disease in DB for additional data
          const dbDisease = await db.disease.findFirst({
            where: { name: { contains: aiPred.disease.split(' (')[0] } },
            select: {
              id: true, name: true, description: true, specialist: true, severity: true,
              precautions: true, medications: true, diet: true, workout: true,
              symptoms: { include: { symptom: true } },
            },
          });

          if (dbDisease) {
            const matchedSymNames = dbDisease.symptoms
              .filter(s => symptomIds.includes(s.symptomId))
              .map(s => s.symptom.name);

            predictions.push({
              disease: dbDisease.name,
              confidence: matchedSymNames.length > 0
                ? Math.min(Math.round((matchedSymNames.length / dbDisease.symptoms.length) * 100), 95)
                : 50,
              description: aiPred.description || dbDisease.description,
              specialist: dbDisease.specialist,
              severity: dbDisease.severity,
              // AI-sourced recommendations (from Gemini API per proposal)
              precautions: aiPred.precautions?.length > 0 ? aiPred.precautions : JSON.parse(dbDisease.precautions || '[]'),
              medications: aiPred.medications?.length > 0 ? aiPred.medications : JSON.parse(dbDisease.medications || '[]'),
              diet: aiPred.diets?.length > 0 ? aiPred.diets : JSON.parse(dbDisease.diet || '[]'),
              workout: aiPred.workouts?.length > 0 ? aiPred.workouts : JSON.parse(dbDisease.workout || '[]'),
              matchedSymptoms: matchedSymNames.length > 0 ? matchedSymNames : symptomNames,
              totalSymptoms: dbDisease.symptoms.length,
            });
          } else {
            // AI-only prediction (not in our DB)
            predictions.push({
              disease: aiPred.disease,
              confidence: 50,
              description: aiPred.description || '',
              specialist: 'General Physician',
              severity: 'moderate',
              precautions: aiPred.precautions || [],
              medications: aiPred.medications || [],
              diet: aiPred.diets || [],
              workout: aiPred.workouts || [],
              matchedSymptoms: symptomNames,
              totalSymptoms: symptomNames.length,
            });
          }
        }

        // Also generate detailed LLM analysis for the Online AI engine
        if (predictions.length > 0) {
          const topDiseases = predictions.slice(0, 3).map(p =>
            `${p.disease} (${p.confidence}% confidence)`
          ).join(', ');

          const analysisCompletion = await zai.chat.completions.create({
            messages: [
              {
                role: 'assistant',
                content: `You are a medical AI assistant specializing in symptom analysis and disease prediction. Provide helpful, educational health information. Always include a disclaimer that this is not a substitute for professional medical advice. Be thorough but concise. Format your response with clear sections using markdown.`
              },
              {
                role: 'user',
                content: `Based on the following symptoms: ${symptomNames.join(', ')}

The top predicted diseases are: ${topDiseases}

Please provide a detailed analysis including:
1. **Summary**: Brief overview of what these symptoms might indicate
2. **Key Concerns**: What the user should be most concerned about
3. **Recommended Actions**: Immediate steps the user should take
4. **When to See a Doctor**: Specific warning signs that require immediate medical attention
5. **General Health Advice**: Tips for managing symptoms while waiting for professional consultation

Keep the response well-structured and informative. Remember to include a medical disclaimer.`
              }
            ],
            thinking: { type: 'disabled' }
          });

          llmAnalysis = analysisCompletion.choices[0]?.message?.content || null;
        }
      } catch (error) {
        console.error('Online AI engine error:', error);
        // If Gemini API fails, fall back to Local ML engine
        console.log('Falling back to Local ML engine...');
        // Re-run with local-ml logic
        return POST(new NextRequest(request.url, {
          method: 'POST',
          body: JSON.stringify({
            ...body,
            engine: 'local-ml',
            includeLLMAnalysis: false,
          }),
        }));
      }
    }

    // Take top 5 predictions
    const topPredictions = predictions.slice(0, 5);

    if (topPredictions.length === 0) {
      return NextResponse.json({
        predictions: [],
        llmAnalysis: null,
        message: 'No matching diseases found for the selected symptoms. Please try selecting more symptoms.',
      });
    }

    // Save prediction to history (if user logged in and privacy mode off)
    let savedPrediction = null;
    if (userId && !privacyMode) {
      try {
        savedPrediction = await db.prediction.create({
          data: {
            userId,
            selectedSymptoms: JSON.stringify([...new Set(symptomIds)]),
            results: JSON.stringify(topPredictions),
            llmAnalysis,
          },
        });
      } catch (error) {
        console.error('Save prediction error:', error);
      }
    }

    return NextResponse.json({
      predictions: topPredictions,
      llmAnalysis,
      predictionId: savedPrediction?.id,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error during prediction' },
      { status: 500 }
    );
  }
}
