import { Router } from 'express';
import * as reportsController from './reports.controller';

const router = Router();

/**
 * @swagger
 * /api/reports/orders/summary:
 *   get:
 *     summary: Get order summary report (paid orders)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Order summary report
 */
router.get('/orders/summary', reportsController.getOrderSummaryReport);

/**
 * @swagger
 * /api/reports/orders/detailed:
 *   get:
 *     summary: Get order detailed report (paid orders)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Order detailed report
 */
router.get('/orders/detailed', reportsController.getOrderDetailedReport);

/**
 * @swagger
 * /api/reports/orders/payments:
 *   get:
 *     summary: Get payments report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Payments report
 */
router.get('/orders/payments', reportsController.getPaymentsReport);

/**
 * @swagger
 * /api/reports/orders/refunds:
 *   get:
 *     summary: Get refunds report (refunded dissatisfactions)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Refunds report
 */
router.get('/orders/refunds', reportsController.getRefundsReport);

export default router;