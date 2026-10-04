import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, attachSessionCookie } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, age, gender, bloodGroup } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long for security' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const user = await createUser({
      email: normalizedEmail,
      name: String(name).trim(),
      password,
      age: age ? parseInt(String(age), 10) : undefined,
      gender: gender ? String(gender).trim() : undefined,
      bloodGroup: bloodGroup ? String(bloodGroup).trim() : undefined,
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age,
      gender: user.gender,
      bloodGroup: user.bloodGroup,
    };

    const response = NextResponse.json(sessionUser, { status: 201 });
    attachSessionCookie(response, sessionUser);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
