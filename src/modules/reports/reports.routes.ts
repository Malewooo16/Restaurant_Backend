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

// Purchase Reports
router.get('/purchases/goods-received', reportsController.getGoodsReceivedReport);
router.get('/purchases/order-detailed', reportsController.getPurchaseOrderDetailedReport);
router.get('/purchases/order-summary', reportsController.getPurchaseOrderSummaryReport);
router.get('/purchases/suppliers', reportsController.getSuppliersListReport);

// Inventory Reports
router.get('/inventory/summary', reportsController.getInventorySummaryReport);
router.get('/inventory/low-stock', reportsController.getLowStockReport);
router.get('/inventory/adjustments', reportsController.getInventoryAdjustmentsReport);
router.get('/inventory/requests', reportsController.getInventoryRequestsReport);
router.get('/inventory/expiring-batches', reportsController.getExpiringBatchesReport);

// Accounting Reports
router.get('/accounting/expenses/summary', reportsController.getExpenseSummaryReport);
router.get('/accounting/expenses/detailed', reportsController.getExpenseDetailedReport);

// Profit & Revenue Reports
router.get('/accounting/revenue', reportsController.getRevenueReport);
router.get('/accounting/gross-profit', reportsController.getGrossProfitReport);
router.get('/accounting/net-profit', reportsController.getNetProfitReport);

export default router;