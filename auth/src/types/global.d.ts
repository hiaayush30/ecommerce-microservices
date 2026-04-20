import * as express from 'express';
import type { JwtPayload } from './types.js';

declare global {
  namespace Express {
    interface Request {
      user ?: JwtPayload
    }
  }
}