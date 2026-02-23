import { Router } from 'express';
import * as expenseController from './expense.controller';
import * as expenseCategoryController from './expense-category.controller';
import { validate } from '../../middleware/validate';
import { requirePermission } from '../../middleware/permissions';
import * as expenseValidation from './expense.validation';
import * as expenseCategoryValidation from './expense-category.validation';

const router = Router();

// Permission middleware for accounting/expense routes
const viewAccounting = requirePermission('accounting.view');
const manageExpenses = requirePermission('accounting.expenses');

/**
 * @swagger
 * /api/expense:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expense]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpense'
 *     responses:
 *       201:
 *         description: The created expense.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 */
router.post(
  '/',
  manageExpenses,
  validate(expenseValidation.createExpenseSchema),
  expenseController.createExpense
);

/**
 * @swagger
 * /api/expense:
 *   get:
 *     summary: Retrieve a list of expenses
 *     tags: [Expense]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date filter (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date filter (ISO format)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: A list of expenses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
router.get('/', viewAccounting, expenseController.getAllExpenses);

/**
 * @swagger
 * /api/expense/{id}:
 *   get:
 *     summary: Retrieve a single expense
 *     tags: [Expense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single expense.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 */
router.get('/:id', viewAccounting, expenseController.getExpenseById);

/**
 * @swagger
 * /api/expense/{id}:
 *   patch:
 *     summary: Update an expense
 *     tags: [Expense]
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
 *             $ref: '#/components/schemas/UpdateExpense'
 *     responses:
 *       200:
 *         description: The updated expense.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 */
router.patch(
  '/:id',
  manageExpenses,
  validate(expenseValidation.updateExpenseSchema),
  expenseController.updateExpense
);

/**
 * @swagger
 * /api/expense/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:id', manageExpenses, expenseController.deleteExpense);

export default router;
