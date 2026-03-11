import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middleware/error.js';
import { requireAuth, AuthPayload } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

function generateToken(user: { id: number; email: string }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  const payload: AuthPayload = { userId: user.id, email: user.email };
  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });
}

function setTokenCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    // Validate at boundary
    if (!username || !email || !password) {
      throw ApiError.badRequest('Username, email, and password are required');
    }

    if (typeof username !== 'string' || username.length < 3 || username.length > 30) {
      throw ApiError.validation('Username must be 3-30 characters');
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      throw ApiError.validation('Valid email is required');
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw ApiError.validation('Password must be at least 6 characters');
    }

    // Check for duplicates
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      throw ApiError.conflict(
        existing.email === email ? 'Email already in use' : 'Username already taken'
      );
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        joinedAt: user.joinedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        joinedAt: user.joinedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', { path: '/' });
  res.json({ success: true });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, username: true, email: true, avatar: true, bio: true, joinedAt: true },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export { router as authRouter };
