import { Router } from 'express';
import * as expenseCategoryController from './expense-category.controller';
import { validate } from '../../middleware/validate';
import * as expenseCategoryValidation from './expense-category.validation';

const router = Router();

/**
 * @swagger
 * /api/expense-categories:
 *   post:
 *     summary: Create a new expense category
 *     tags: [Expense Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExpenseCategory'
 *     responses:
 *       201:
 *         description: The created expense category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseCategory'
 */
router.post(
  '/',
  validate(expenseCategoryValidation.createExpenseCategorySchema),
  expenseCategoryController.createExpenseCategory
);

/**
 * @swagger
 * /api/expense-categories:
 *   get:
 *     summary: Retrieve a list of expense categories
 *     tags: [Expense Category]
 *     responses:
 *       200:
 *         description: A list of expense categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExpenseCategory'
 */
router.get('/', expenseCategoryController.getAllExpenseCategories);

/**
 * @swagger
 * /api/expense-categories/{id}:
 *   get:
 *     summary: Retrieve a single expense category
 *     tags: [Expense Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single expense category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseCategory'
 */
router.get('/:id', expenseCategoryController.getExpenseCategoryById);

/**
 * @swagger
 * /api/expense-categories/{id}:
 *   patch:
 *     summary: Update an expense category
 *     tags: [Expense Category]
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
 *             $ref: '#/components/schemas/UpdateExpenseCategory'
 *     responses:
 *       200:
 *         description: The updated expense category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExpenseCategory'
 */
router.patch(
  '/:id',
  validate(expenseCategoryValidation.updateExpenseCategorySchema),
  expenseCategoryController.updateExpenseCategory
);

/**
 * @swagger
 * /api/expense-categories/{id}:
 *   delete:
 *     summary: Delete an expense category
 *     tags: [Expense Category]
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
router.delete('/:id', expenseCategoryController.deleteExpenseCategory);

export default router;
