import { Router } from 'express';
import { myListController } from '../controllers/mylist.controller';
import { authenticate } from '../middleware/auth';
import {
    validate,
    addToMyListSchema,
    listMyItemsSchema,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /mylist:
 *   post:
 *     summary: Add an item to My List
 *     tags: [My List]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contentId
 *               - contentType
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: ID of the movie or TV show
 *               contentType:
 *                 type: string
 *                 enum: [movie, tvshow]
 *                 description: Type of content
 *     responses:
 *       201:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item added to My List successfully
 *                 item:
 *                   $ref: '#/components/schemas/MyListItem'
 *       400:
 *         description: Validation error or item already exists
 *       401:
 *         description: Unauthorized - Missing x-user-id header
 */
router.post(
    '/',
    validate(addToMyListSchema),
    (req, res, next) => {
        myListController.addToMyList(req, res).catch(next);
    }
);

/**
 * @swagger
 * /mylist/{contentId}:
 *   delete:
 *     summary: Remove an item from My List
 *     tags: [My List]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to remove (Note this is the original content ID, not the list item ID)
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item removed from My List successfully
 *       404:
 *         description: Item not found in My List
 *       401:
 *         description: Unauthorized
 */
router.delete('/:contentId', (req, res, next) => {
    myListController.removeFromMyList(req, res).catch(next);
});

/**
 * @swagger
 * /mylist:
 *   get:
 *     summary: List all items in My List
 *     tags: [My List]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: List of items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MyListItem'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/',
    validate(listMyItemsSchema),
    (req, res, next) => {
        myListController.listMyItems(req, res).catch(next);
    }
);

export default router;
