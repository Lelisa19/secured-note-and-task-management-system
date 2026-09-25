import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../lib/prisma.js';
import { registerSchema, loginSchema, googleAuthSchema } from '../lib/validations.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const searchOrganizations = async (query?: string) => {
  const searchFilter = query && query.trim().length > 0
    ? {
        name: {
          contains: query.trim(),
        },
      }
    : {};

  return prisma.workspace.findMany({
    where: searchFilter,
    select: {
      id: true,
      name: true,
      description: true,
    },
    take: 10,
  });
};

export const register = async (data: { fullName: string; email: string; password: string }) => {
  const validated = registerSchema.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(validated.password, 12);
  const now = new Date();

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      email: validated.email,
      password: hashedPassword,
      fullName: validated.fullName,
      updatedAt: now,
    },
  });

  await prisma.subscription.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      plan: 'FREE',
      updatedAt: now,
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

  await prisma.securitylog.create({
    data: {
      id: randomUUID(),
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

export const loginWithGoogle = async (data: { credential: string; clientId?: string }) => {
  const validated = googleAuthSchema.parse(data);
  const expectedAudience = process.env.GOOGLE_CLIENT_ID || validated.clientId;

  if (!expectedAudience) {
    throw new Error('GOOGLE_CLIENT_ID is not configured on the server');
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: validated.credential,
      audience: expectedAudience,
    });
  } catch (err: any) {
    throw new Error(`Invalid Google credential: ${err?.message || 'verification failed'}`);
  }

  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.email_verified) {
    throw new Error('Google account does not have a verified email');
  }

  const email = payload.email.toLowerCase();
  const fullName = payload.name || payload.email.split('@')[0];
  const avatar = payload.picture || null;

  let isNewUser = false;
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    isNewUser = true;
    const randomPassword = `google-oauth::${randomUUID()}`;
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        password: hashedPassword,
        fullName,
        avatar,
        isVerified: true,
        updatedAt: new Date(),
      },
    });

    await prisma.subscription.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        plan: 'FREE',
        updatedAt: new Date(),
      },
    });
  } else if (!user.avatar && avatar) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { avatar, isVerified: true },
    });
  } else if (!user.isVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  await prisma.securitylog.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      action: 'LOGIN_GOOGLE',
    },
  });

  const token = generateToken(user);
  return { user: sanitizeUser(user), token, isNewUser };
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
