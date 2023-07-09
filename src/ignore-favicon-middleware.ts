import { NextFunction, Request, Response } from 'express';

/**
 * Middleware which responds to `favicon.ico` with a HTTP 204.
 *
 * @param req - The request.
 * @param res - The response (not used here!).
 * @param next - The next function.
 */
export function ignoreFavicon(req: Request, res: Response, next: NextFunction): void {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
    return;
  }
  next();
}
