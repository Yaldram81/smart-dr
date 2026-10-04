import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10', 10), 1), 50);

    // Resolve effective user ID: enforce session ownership if logged in
    const effectiveUserId = sessionUser?.id || requestedUserId;

    if (!effectiveUserId) {
      return NextResponse.json(
        { error: 'User ID or authenticated session is required' },
        { status: 401 }
      );
    }

    // Authorization safeguard: prevent cross-user clinical history exfiltration
    if (sessionUser && requestedUserId && sessionUser.id !== requestedUserId) {
      return NextResponse.json(
        { error: 'Forbidden: You cannot access clinical history belonging to another patient.' },
        { status: 403 }
      );
    }

    const predictions = await db.prediction.findMany({
      where: { userId: effectiveUserId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const formatted = predictions.map(p => {
      try {
        return {
          id: p.id,
          selectedSymptoms: JSON.parse(p.selectedSymptoms),
          results: JSON.parse(p.results),
          llmAnalysis: p.llmAnalysis,
          createdAt: p.createdAt,
        };
      } catch {
        return {
          id: p.id,
          selectedSymptoms: [],
          results: [],
          llmAnalysis: p.llmAnalysis,
          createdAt: p.createdAt,
        };
      }
    });

    return NextResponse.json({ predictions: formatted });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    // Verify record existence
    const existing = await db.prediction.findUnique({
      where: { id: predictionId },
      select: { id: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // If authenticated, ensure the user owns this prediction
    if (sessionUser && existing.userId !== sessionUser.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this record' },
        { status: 403 }
      );
    }

    await db.prediction.delete({ where: { id: predictionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
