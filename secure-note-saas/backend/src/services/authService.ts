import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { registerSchema, loginSchema } from '../lib/validations.js';

export const register = async (data: { fullName: string; email: string; password: string }) => {
  const validated = registerSchema.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(validated.password, 12);

  const user = await prisma.user.create({
    data: {
      email: validated.email,
      password: hashedPassword,
      fullName: validated.fullName,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: 'FREE',
    },
  });

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

export const login = async (data: { email: string; password: string }) => {
  const validated = loginSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(validated.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  await prisma.securityLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN',
    },
  });

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUser(user);
};

const generateToken = (user: any) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-for-development';
  const expiresIn = (process.env.JWT_EXPIRES_IN as string) || '7d';
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

const sanitizeUser = (user: any) => {
  const { password, twoFactorSecret, ...rest } = user;
  return rest;
};
