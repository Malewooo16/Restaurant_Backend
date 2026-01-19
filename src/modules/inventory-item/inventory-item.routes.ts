import { Router } from 'express';
import * as inventoryItemController from './inventory-item.controller';
import { validate } from '../../middleware/validate';
import * as inventoryItemValidation from './inventory-item.validation';

const router = Router();

/**
 * @swagger
 * /api/inventory-item:
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory Item]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryItem'
 *     responses:
 *       201:
 *         description: The created inventory item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 */
router.post(
  '/',
  validate(inventoryItemValidation.createInventoryItemSchema),
  inventoryItemController.createInventoryItem
);

/**
 * @swagger
 * /api/inventory-item:
 *   get:
 *     summary: Retrieve a list of inventory items
 *     tags: [Inventory Item]
 *     responses:
 *       200:
 *         description: A list of inventory items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 */
router.get('/', inventoryItemController.getAllInventoryItems);

/**
 * @swagger
 * /api/inventory-item/{id}:
 *   get:
 *     summary: Retrieve a single inventory item
 *     tags: [Inventory Item]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single inventory item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 */
router.get('/:id', inventoryItemController.getInventoryItemById);

/**
 * @swagger
 * /api/inventory-item/{id}:
 *   patch:
 *     summary: Update an inventory item
 *     tags: [Inventory Item]
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
 *             $ref: '#/components/schemas/UpdateInventoryItem'
 *     responses:
 *       200:
 *         description: The updated inventory item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryItem'
 */
router.patch(
  '/:id',
  validate(inventoryItemValidation.updateInventoryItemSchema),
  inventoryItemController.updateInventoryItem
);

/**
 * @swagger
 * /api/inventory-item/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory Item]
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
router.delete('/:id', inventoryItemController.deleteInventoryItem);

export default router;
