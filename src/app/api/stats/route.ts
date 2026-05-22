import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [diseaseCount, symptomCount, predictionCount, userCount] = await Promise.all([
      db.disease.count(),
      db.symptom.count(),
      db.prediction.count(),
      db.user.count(),
    ]);

    // Get symptom categories
    const categories = await db.symptom.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    // Get severity distribution
    const diseases = await db.disease.findMany({
      select: { severity: true },
    });

    const severityCount = diseases.reduce((acc, d) => {
      acc[d.severity] = (acc[d.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get category distribution
    const allSymptoms = await db.symptom.findMany({
      select: { category: true },
    });

    const categoryCount = allSymptoms.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      diseaseCount,
      symptomCount,
      predictionCount,
      userCount,
      categoryCount,
      severityCount,
      categories: categories.map(c => c.category),
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
