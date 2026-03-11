export interface Game {
  id: number;
  title: string;
  genres: string[];
  platforms: string[];
  releaseYear: number;
  coverImage: string;
  coverGradient: string;
  accentColor: string;
  criticScore: number;
  description: string;
  longDescription: string;
  developer: string;
  publisher: string;
  tags: string[];
  userScore: number;
  reviewCount: number;
  reviews?: Review[];
}

export interface Review {
  id: number;
  score: number;
  body: string;
  createdAt: string;
  helpfulVotes: number;
  gameId: number;
  userId: number;
  user?: UserBrief;
  game?: GameBrief;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinedAt: string;
  reviews?: Review[];
}

export interface UserBrief {
  id: number;
  username: string;
  avatar: string;
}

export interface GameBrief {
  id: number;
  title: string;
  coverImage: string;
  coverGradient: string;
  criticScore: number;
  genres?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  error: string;
  code: string;
}
