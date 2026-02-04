import { Router } from 'express';
import * as paymentController from './payment.controller';
import { validate } from '../../middleware/validate';
import * as paymentValidation from './payment.validation';

const router = Router();

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePayment'
 *     responses:
 *       201:
 *         description: The created payment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
router.post(
  '/',
  validate(paymentValidation.createPaymentSchema),
  paymentController.createPayment
);

/**
 * @swagger
 * /api/payments/split:
 *   post:
 *     summary: Process split bill payments (multiple payment methods)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               payments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     paymentMethod:
 *                       type: string
 *                       enum: [CASH, CARD, ONLINE]
 *                     transactionId:
 *                       type: string
 *     responses:
 *       201:
 *         description: Array of created payments
 */
router.post(
  '/split',
  validate(paymentValidation.createSplitPaymentSchema),
  paymentController.processSplitPayment
);

/**
 * @swagger
 * /api/payments/order/:orderId/summary:
 *   get:
 *     summary: Get payment summary for an order
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment summary for the order
 */
router.get('/order/:orderId/summary', paymentController.getOrderPaymentSummary);

/**
 * @swagger
 * /api/payments/order/:orderId:
 *   get:
 *     summary: Get all payments for an order
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of payments for the order
 */
router.get('/order/:orderId', paymentController.getPaymentsByOrderId);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Retrieve a list of payments
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: A list of payments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
router.get('/', paymentController.getAllPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Retrieve a single payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single payment.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
router.get('/:id', paymentController.getPaymentById);

/**
 * @swagger
 * /api/payments/{id}/refund:
 *   post:
 *     summary: Refund a payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Refunded payment
 */
router.post('/:id/refund', paymentController.refundPayment);

export default router;
