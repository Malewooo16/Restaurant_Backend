import { Router } from 'express';
import * as inventoryCategoryController from './inventory-category.controller';
import { validate } from '../../middleware/validate';
import * as inventoryCategoryValidation from './inventory-category.validation';

const router = Router();

/**
 * @swagger
 * /api/inventory-category:
 *   post:
 *     summary: Create a new inventory category
 *     tags: [Inventory Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryCategory'
 *     responses:
 *       201:
 *         description: The created inventory category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryCategory'
 */
router.post(
  '/',
  validate(inventoryCategoryValidation.createInventoryCategorySchema),
  inventoryCategoryController.createInventoryCategory
);

/**
 * @swagger
 * /api/inventory-category:
 *   get:
 *     summary: Retrieve a list of inventory categories
 *     tags: [Inventory Category]
 *     responses:
 *       200:
 *         description: A list of inventory categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryCategory'
 */
router.get('/', inventoryCategoryController.getAllInventoryCategories);

/**
 * @swagger
 * /api/inventory-category/{id}:
 *   get:
 *     summary: Retrieve a single inventory category
 *     tags: [Inventory Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single inventory category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryCategory'
 */
router.get('/:id', inventoryCategoryController.getInventoryCategoryById);

/**
 * @swagger
 * /api/inventory-category/{id}:
 *   patch:
 *     summary: Update an inventory category
 *     tags: [Inventory Category]
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
 *             $ref: '#/components/schemas/UpdateInventoryCategory'
 *     responses:
 *       200:
 *         description: The updated inventory category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryCategory'
 */
router.patch(
  '/:id',
  validate(inventoryCategoryValidation.updateInventoryCategorySchema),
  inventoryCategoryController.updateInventoryCategory
);

/**
 * @swagger
 * /api/inventory-category/{id}:
 *   delete:
 *     summary: Delete an inventory category
 *     tags: [Inventory Category]
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
router.delete('/:id', inventoryCategoryController.deleteInventoryCategory);

export default router;
