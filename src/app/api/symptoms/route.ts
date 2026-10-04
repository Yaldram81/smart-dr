import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const symptoms = await db.symptom.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    // Group by category
    const categories = symptoms.reduce((acc, symptom) => {
      const cat = symptom.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        id: symptom.id,
        name: symptom.name,
        slug: symptom.slug,
        description: symptom.description,
        bodySystem: symptom.bodySystem,
        alternateNames: symptom.alternateNames,
        imageUrl: symptom.imageUrl,
      });
      return acc;
    }, {} as Record<string, { id: string; name: string; slug: string; description: string | null; bodySystem?: string | null; alternateNames?: string[]; imageUrl?: string | null }[]>);

    return NextResponse.json({ symptoms, categories });
  } catch (error) {
    console.error('Symptoms fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
