import { Router } from 'express';
import {
  getAccountingSummary,
  getRecentTransactions,
  getDailySummary,
  getExpenseBreakdown,
} from './accounting.controller';

const router = Router();

/**
 * @swagger
 * /api/accounting/summary:
 *   get:
 *     summary: Get accounting summary (revenue, expenses, purchases, net profit)
 *     tags: [Accounting]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Accounting summary
 */
router.get('/summary', getAccountingSummary);

/**
 * @swagger
 * /api/accounting/transactions:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Accounting]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of recent transactions
 */
router.get('/transactions', getRecentTransactions);

/**
 * @swagger
 * /api/accounting/daily:
 *   get:
 *     summary: Get daily summary for chart
 *     tags: [Accounting]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Daily revenue and expense data
 */
router.get('/daily', getDailySummary);

/**
 * @swagger
 * /api/accounting/expenses/breakdown:
 *   get:
 *     summary: Get expense breakdown by category
 *     tags: [Accounting]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Expense breakdown by category
 */
router.get('/expenses/breakdown', getExpenseBreakdown);

export default router;