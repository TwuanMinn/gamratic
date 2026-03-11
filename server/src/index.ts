import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { gamesRouter } from './routes/games.js';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware stack (ordered per best practices)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/users', usersRouter);

// Community stats
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

app.get('/api/stats', async (_req, res) => {
  try {
    const [totalGames, totalReviews, activeReviewers, avgResult] = await Promise.all([
      prisma.game.count(),
      prisma.review.count(),
      prisma.user.count(),
      prisma.review.aggregate({ _avg: { score: true } }),
    ]);
    res.json({
      success: true,
      data: {
        totalGames,
        totalReviews,
        avgScore: Math.round((avgResult._avg.score || 0) * 10) / 10,
        activeReviewers,
      },
    });
  } catch {
    res.json({ success: true, data: { totalGames: 0, totalReviews: 0, avgScore: 0, activeReviewers: 0 } });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handler (LAST middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🎮 Gamratic API running on http://localhost:${PORT}`);
});

export default app;
