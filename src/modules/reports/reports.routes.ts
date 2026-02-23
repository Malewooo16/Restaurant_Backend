import { Router } from 'express';
import * as reportsController from './reports.controller';
import { requirePermission } from '../../middleware/permissions';

const router = Router();

// Permission middleware for reports routes
const viewReports = requirePermission('reports.view');
const exportReports = requirePermission('reports.export');

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
router.get('/orders/summary', viewReports, reportsController.getOrderSummaryReport);

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
router.get('/orders/detailed', viewReports, reportsController.getOrderDetailedReport);

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
router.get('/orders/payments', viewReports, reportsController.getPaymentsReport);

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
router.get('/orders/refunds', viewReports, reportsController.getRefundsReport);

export default router;