import { Router } from 'express';
import * as stockRequestController from './stock-request.controller';
import { validate } from '../../middleware/validate';
import * as stockRequestValidation from './stock-request.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stock Request
 *   description: API for managing stock requests
 */

/**
 * @swagger
 * /api/stock-request:
 *   get:
 *     summary: Retrieve a list of stock requests
 *     tags: [Stock Request]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [KITCHEN, BAR, SERVICE, OPERATIONS, MANAGEMENT]
 *         description: Filter stock requests by the department they were requested from.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, fulfilled]
 *         description: Filter stock requests by status.
 *     responses:
 *       200:
 *         description: A list of stock requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockRequest'
 */
router.get(
  '/',
  validate(stockRequestValidation.getAllStockRequestsSchema),
  stockRequestController.getAllStockRequests
);

/**
 * @swagger
 * /api/stock-request:
 *   post:
 *     summary: Create a new stock request
 *     tags: [Stock Request]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockRequestInput'
 *     responses:
 *       201:
 *         description: The created stock request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockRequest'
 */
router.post(
  '/',
  validate(stockRequestValidation.createStockRequestSchema),
  stockRequestController.createStockRequest
);

/**
 * @swagger
 * /api/stock-request/{id}/status:
 *   patch:
 *     summary: Update the status of a stock request
 *     tags: [Stock Request]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the stock request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *                 description: The new status of the stock request.
 *     responses:
 *       200:
 *         description: The updated stock request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockRequest'
 */
router.patch(
  '/:id/status',
  validate(stockRequestValidation.updateStockRequestStatusSchema),
  stockRequestController.updateStockRequestStatus
);

export default router;
