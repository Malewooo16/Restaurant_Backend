import { Router } from 'express';
import * as goodsReceivingController from './goods-receiving.controller';
import { validate } from '../../middleware/validate';
import * as goodsReceivingValidation from './goods-receiving.validation';

const router = Router();

/**
 * @swagger
 * /api/goods-receiving:
 *   post:
 *     summary: Create a new goods receiving record
 *     tags: [Goods Receiving]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGoodsReceiving'
 *     responses:
 *       201:
 *         description: The created goods receiving record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoodsReceiving'
 */
router.post(
  '/',
  validate(goodsReceivingValidation.createGoodsReceivingSchema),
  goodsReceivingController.createGoodsReceiving
);

/**
 * @swagger
 * /api/goods-receiving:
 *   get:
 *     summary: Get all goods receiving records
 *     tags: [Goods Receiving]
 *     responses:
 *       200:
 *         description: A list of goods receiving records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GoodsReceiving'
 */
router.get('/', goodsReceivingController.getAllGoodsReceiving);

/**
 * @swagger
 * /api/goods-receiving/po/{purchaseOrderId}:
 *   get:
 *     summary: Get all goods receiving records for a purchase order
 *     tags: [Goods Receiving]
 *     parameters:
 *       - in: path
 *         name: purchaseOrderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of goods receiving records for the PO.
 */
router.get('/po/:purchaseOrderId', goodsReceivingController.getGoodsReceivingByPurchaseOrderId);

/**
 * @swagger
 * /api/goods-receiving/{id}:
 *   get:
 *     summary: Get a goods receiving record by ID
 *     tags: [Goods Receiving]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The goods receiving record with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoodsReceiving'
 *       404:
 *         description: Goods receiving record not found.
 */
router.get('/:id', goodsReceivingController.getGoodsReceivingById);

/**
 * @swagger
 * /api/goods-receiving/{id}:
 *   patch:
 *     summary: Update a goods receiving record by ID
 *     tags: [Goods Receiving]
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
 *             $ref: '#/components/schemas/UpdateGoodsReceiving'
 *     responses:
 *       200:
 *         description: The updated goods receiving record.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoodsReceiving'
 *       404:
 *         description: Goods receiving record not found.
 */
router.patch(
  '/:id',
  validate(goodsReceivingValidation.updateGoodsReceivingSchema),
  goodsReceivingController.updateGoodsReceiving
);

/**
 * @swagger
 * /api/goods-receiving/{id}:
 *   delete:
 *     summary: Delete a goods receiving record by ID
 *     tags: [Goods Receiving]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Goods receiving record deleted successfully.
 *       404:
 *         description: Goods receiving record not found.
 */
router.delete('/:id', goodsReceivingController.deleteGoodsReceiving);

export default router;
