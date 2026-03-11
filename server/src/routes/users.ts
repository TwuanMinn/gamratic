import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middleware/error.js';

const prisma = new PrismaClient();
const router = Router();

// GET /api/users/:id — user profile + their reviews
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Invalid user ID');
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
        joinedAt: true,
        reviews: {
          include: {
            game: {
              select: { id: true, title: true, coverGradient: true, coverImage: true, criticScore: true, genres: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export { router as usersRouter };
