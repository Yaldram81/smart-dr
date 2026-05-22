import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are MedPredict AI Assistant, a helpful and empathetic health information assistant. Your role is to:

1. **Provide General Health Information**: Share evidence-based health knowledge, explain medical terms in simple language, and help users understand common health conditions.

2. **Help Users Understand Symptoms**: Listen carefully to described symptoms, provide possible general explanations, and help users decide when to seek professional medical care.

3. **Give Lifestyle and Wellness Tips**: Offer practical advice on nutrition, exercise, sleep hygiene, stress management, and preventive health measures.

4. **Include Medical Disclaimers**: ALWAYS include a clear medical disclaimer in your responses, such as: "⚠️ This information is for educational purposes only and is not a substitute for professional medical advice. Please consult a healthcare provider for personalized guidance."

5. **Be Empathetic and Professional**: Show genuine care and understanding. Acknowledge the user's concerns, validate their feelings, and respond with compassion while maintaining a professional tone.

6. **Never Diagnose or Prescribe**: You must NEVER provide a definitive diagnosis, prescribe medications, recommend specific treatment plans, or suggest discontinuing any prescribed medication. Always direct users to qualified healthcare professionals for diagnosis and treatment.

Important guidelines:
- If a user describes symptoms that could indicate a medical emergency (e.g., chest pain, difficulty breathing, signs of stroke), strongly advise them to seek immediate emergency care.
- Do not speculate on rare or serious conditions; instead, focus on general information and encourage professional consultation.
- Keep your responses clear, concise, and easy to understand.
- Use bullet points or numbered lists for readability when appropriate.
- If you are unsure about something, be honest and recommend the user consult a healthcare professional.
- Respect user privacy — do not ask for personally identifiable information.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], userId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 5000 characters.' },
        { status: 400 }
      );
    }

    if (history && !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'History must be an array' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: h.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    });

    const response =
      completion.choices[0]?.message?.content ||
      'I apologize, but I was unable to process your request. Please try again or consult a healthcare professional.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message. Please try again later.' },
      { status: 500 }
    );
  }
}
