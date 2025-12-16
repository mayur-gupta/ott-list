import { Request, Response } from 'express';
import { myListService } from '../services/mylist.service';
import { ContentType } from '../types';

export class MyListController {
    /**
     * Add item to My List
     * POST /api/v1/mylist
     */
    async addToMyList(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { contentId, contentType } = req.body;

            const result = await myListService.addToMyList(
                userId,
                contentId,
                contentType as ContentType
            );

            if (!result.success) {
                res.status(400).json(result);
                return;
            }

            res.status(201).json(result);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Remove item from My List
     * DELETE /api/v1/mylist/:contentId
     */
    async removeFromMyList(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { contentId } = req.params;

            const result = await myListService.removeFromMyList(userId, contentId);

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            throw error;
        }
    }

    /**
     * List all items in My List
     * GET /api/v1/mylist
     */
    async listMyItems(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).userId;
            const { page, limit } = req.query;

            const result = await myListService.listMyItems(userId, {
                page: parseInt(page as string) || 1,
                limit: parseInt(limit as string) || 20,
            });

            res.status(200).json({
                success: true,
                ...result,
            });
        } catch (error) {
            throw error;
        }
    }
}

export const myListController = new MyListController();
