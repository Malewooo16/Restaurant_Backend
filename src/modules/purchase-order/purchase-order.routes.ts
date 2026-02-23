import { Router } from 'express';
import * as purchaseOrderController from './purchase-order.controller';
import { validate } from '../../middleware/validate';
import { requirePermission } from '../../middleware/permissions';
import * as purchaseOrderValidation from './purchase-order.validation';

const router = Router();

// Permission middleware for purchases routes
const viewPurchases = requirePermission('purchases.view');
const createPurchases = requirePermission('purchases.create');
const approvePurchases = requirePermission('purchases.approve');
const receivePurchases = requirePermission('purchases.receive');

/**
 * @swagger
 * /api/purchase-orders:
 *   post:
 *     summary: Create a new purchase order
 *     tags: [Purchase Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePurchaseOrder'
 *     responses:
 *       201:
 *         description: The created purchase order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 */
router.post(
  '/',
  createPurchases,
  validate(purchaseOrderValidation.createPurchaseOrderSchema),
  purchaseOrderController.createPurchaseOrder
);

/**
 * @swagger
 * /api/purchase-orders:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [Purchase Order]
 *     responses:
 *       200:
 *         description: A list of purchase orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseOrder'
 */
router.get('/', viewPurchases, purchaseOrderController.getAllPurchaseOrders);

/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   get:
 *     summary: Get a purchase order by ID
 *     tags: [Purchase Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The purchase order with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 *       404:
 *         description: Purchase order not found.
 */
router.get('/:id', viewPurchases, purchaseOrderController.getPurchaseOrderById);

/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   patch:
 *     summary: Update a purchase order by ID
 *     tags: [Purchase Order]
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
 *             $ref: '#/components/schemas/UpdatePurchaseOrder'
 *     responses:
 *       200:
 *         description: The updated purchase order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 *       404:
 *         description: Purchase order not found.
 */
router.patch(
  '/:id',
  createPurchases,
  validate(purchaseOrderValidation.updatePurchaseOrderSchema),
  purchaseOrderController.updatePurchaseOrder
);

/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   delete:
 *     summary: Delete a purchase order by ID
 *     tags: [Purchase Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Purchase order deleted successfully.
 *       404:
 *         description: Purchase order not found.
 */
router.delete('/:id', createPurchases, purchaseOrderController.deletePurchaseOrder);

/**
 * @swagger
 * /api/purchase-orders/{id}/approve:
 *   post:
 *     summary: Approve a purchase order
 *     tags: [Purchase Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order approved successfully.
 */
router.post('/:id/approve', approvePurchases, purchaseOrderController.approvePurchaseOrder);

/**
 * @swagger
 * /api/purchase-orders/{id}/reject:
 *   post:
 *     summary: Reject a purchase order
 *     tags: [Purchase Order]
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
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejection
 *     responses:
 *       200:
 *         description: Purchase order rejected successfully.
 */
router.post('/:id/reject', approvePurchases, purchaseOrderController.rejectPurchaseOrder);

/**
 * @swagger
 * /api/purchase-orders/{id}/partially-received:
 *   post:
 *     summary: Mark a purchase order as partially received
 *     tags: [Purchase Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order marked as partially received.
 */
router.post('/:id/partially-received', receivePurchases, purchaseOrderController.markPartiallyReceived);

/**
 * @swagger
 * /api/purchase-orders/{id}/complete:
 *   post:
 *     summary: Mark a purchase order as completed
 *     tags: [Purchase Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase order marked as completed.
 */
router.post('/:id/complete', receivePurchases, purchaseOrderController.markCompleted);

export default router;