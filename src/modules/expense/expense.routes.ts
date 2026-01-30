import { Router } from 'express';
import * as expenseController from './expense.controller';
import { validate } from '../../middleware/validate';
import * as expenseValidation from './expense.validation';

const router = Router();

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
  validate(expenseValidation.createExpenseSchema),
  expenseController.createExpense
);

/**
 * @swagger
 * /api/expense:
 *   get:
 *     summary: Retrieve a list of expenses
 *     tags: [Expense]
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
router.get('/', expenseController.getAllExpenses);

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
router.get('/:id', expenseController.getExpenseById);

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
router.delete('/:id', expenseController.deleteExpense);

export default router;
