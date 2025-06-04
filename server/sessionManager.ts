
import { Request, Response, NextFunction } from 'express';

interface QuoteSession {
  postcode?: string;
  volume?: number;
  fuelType?: string;
  lastQuote?: any;
  timestamp: number;
}

const sessions = new Map<string, QuoteSession>();

export function createSessionId(): string {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function getSession(sessionId: string): QuoteSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;
  
  // Expire sessions after 2 hours
  if (Date.now() - session.timestamp > 2 * 60 * 60 * 1000) {
    sessions.delete(sessionId);
    return null;
  }
  
  return session;
}

export function updateSession(sessionId: string, data: Partial<QuoteSession>): void {
  const existing = sessions.get(sessionId) || { timestamp: Date.now() };
  sessions.set(sessionId, {
    ...existing,
    ...data,
    timestamp: Date.now()
  });
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  let sessionId = req.cookies.sessionId;
  
  if (!sessionId || !getSession(sessionId)) {
    sessionId = createSessionId();
    res.cookie('sessionId', sessionId, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });
  }
  
  req.sessionId = sessionId;
  next();
}

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}
