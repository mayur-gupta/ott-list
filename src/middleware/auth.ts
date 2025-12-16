import { Request, Response, NextFunction } from 'express';

/**
 * Mock authentication middleware
 * In production, this would verify JWT tokens or session cookies
 * For this assignment, we extract userId from headers
 */
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please provide x-user-id header.',
        });
    }

    // Attach userId to request for use in controllers
    (req as any).userId = userId;
    next();
};
