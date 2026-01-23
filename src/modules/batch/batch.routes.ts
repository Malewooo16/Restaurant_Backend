import { Router } from 'express';
import * as batchController from './batch.controller';
import { validate } from '../../middleware/validate';
import * as batchValidation from './batch.validation';

const router = Router();

/**
 * 
 * /api/batches:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBatch'
 *     responses:
 *       201:
 *         description: The created batch.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 */
router.post(
  '/',
  validate(batchValidation.createBatchSchema),
  batchController.createBatch
);

/**
 * @swagger
 * /api/batches:
 *   get:
 *     summary: Get all batches
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: A list of batches.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Batch'
 */
router.get('/', batchController.getAllBatches);

/**
 * @swagger
 * /api/batches/expiring:
 *   get:
 *     summary: Get batches expiring in the next 10 days
 *     tags: [Batch]
 *     responses:
 *       200:
 *         description: A list of batches expiring soon.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Batch'
 */
router.get('/expiring', batchController.getExpiringBatches);

/**
 * @swagger
 * /api/batches/{id}:
 *   get:
 *     summary: Get a batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The batch with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 *       404:
 *         description: Batch not found.
 */
router.get('/:id', batchController.getBatchById);

/**
 * @swagger
 * /api/batches/{id}:
 *   patch:
 *     summary: Update a batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBatch'
 *     responses:
 *       200:
 *         description: The updated batch.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Batch'
 *       404:
 *         description: Batch not found.
 */
router.patch(
  '/:id',
  validate(batchValidation.updateBatchSchema),
  batchController.updateBatch
);

/**
 * 
 * /api/batches/{id}:
 *   delete:
 *     summary: Delete a batch by ID
 *     tags: [Batch]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Batch deleted successfully.
 *       404:
 *         description: Batch not found.
 */
router.delete('/:id', batchController.deleteBatch);

export default router;
