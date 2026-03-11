import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../middleware/error.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// Helper: parse JSON string arrays from SQLite
function parseJsonArray(value: string): string[] {
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// Helper: compute average user score for a game
function computeUserScore(reviews: { score: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// GET /api/games — list with filters, sorting, search
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, genre, platform, minScore, sort } = req.query;

    const games = await prisma.game.findMany({
      include: {
        reviews: { select: { score: true } },
      },
    });

    let results = games.map((game) => ({
      ...game,
      genres: parseJsonArray(game.genres),
      platforms: parseJsonArray(game.platforms),
      tags: parseJsonArray(game.tags),
      userScore: computeUserScore(game.reviews),
      reviewCount: game.reviews.length,
    }));

    // Filter: search
    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      results = results.filter(
        (g) =>
          g.title.toLowerCase().includes(s) ||
          g.developer.toLowerCase().includes(s) ||
          g.publisher.toLowerCase().includes(s)
      );
    }

    // Filter: genre
    if (genre && typeof genre === 'string') {
      results = results.filter((g) =>
        g.genres.some((gen: string) => gen.toLowerCase() === genre.toLowerCase())
      );
    }

    // Filter: platform
    if (platform && typeof platform === 'string') {
      results = results.filter((g) =>
        g.platforms.some((p: string) => p.toLowerCase() === platform.toLowerCase())
      );
    }

    // Filter: minimum critic score
    if (minScore && typeof minScore === 'string') {
      const min = parseInt(minScore, 10);
      if (!isNaN(min)) {
        results = results.filter((g) => g.criticScore >= min);
      }
    }

    // Sort
    if (sort === 'newest') {
      results.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sort === 'most-reviews') {
      results.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      // Default: top rated
      results.sort((a, b) => b.criticScore - a.criticScore);
    }

    // Strip reviews from list response
    const data = results.map(({ reviews, ...rest }) => rest);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});


// GET /api/games/reviews/recent — latest reviews across all games
router.get('/reviews/recent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const reviews = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true } },
        game: { select: { id: true, title: true, coverImage: true, criticScore: true } },
      },
    });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
});

// GET /api/games/:id — single game with all reviews
router.get('/:id', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Invalid game ID');
    }

    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!game) {
      throw ApiError.notFound('Game not found');
    }

    const result = {
      ...game,
      genres: parseJsonArray(game.genres),
      platforms: parseJsonArray(game.platforms),
      tags: parseJsonArray(game.tags),
      userScore: computeUserScore(game.reviews),
      reviewCount: game.reviews.length,
    };

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/games/:id/reviews — submit review (auth required)
router.post('/:id/reviews', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
      throw ApiError.badRequest('Invalid game ID');
    }

    const { score, body } = req.body;

    // Validate at boundary
    if (score === undefined || body === undefined) {
      throw ApiError.badRequest('Score and body are required');
    }

    const numScore = Number(score);
    if (!Number.isInteger(numScore) || numScore < 1 || numScore > 10) {
      throw ApiError.validation('Score must be an integer between 1 and 10');
    }

    if (typeof body !== 'string' || body.trim().length < 30) {
      throw ApiError.validation('Review body must be at least 30 characters');
    }

    // Verify game exists
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw ApiError.notFound('Game not found');
    }

    // Check for existing review by this user
    const existingReview = await prisma.review.findFirst({
      where: { gameId, userId: req.user!.userId },
    });

    if (existingReview) {
      throw ApiError.conflict('You have already reviewed this game');
    }

    const review = await prisma.review.create({
      data: {
        score: numScore,
        body: body.trim(),
        gameId,
        userId: req.user!.userId,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
});

export { router as gamesRouter };
