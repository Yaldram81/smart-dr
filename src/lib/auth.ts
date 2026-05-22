import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  age?: number | null;
  gender?: string | null;
  bloodGroup?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(data: { email: string; name: string; password: string; age?: number; gender?: string; bloodGroup?: string }) {
  const hashedPassword = await hashPassword(data.password);
  return db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      age: data.age,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
    },
  });
}
