import { Router } from 'express';
import * as inventoryUnitController from './inventory-unit.controller';
import { validate } from '../../middleware/validate';
import * as inventoryUnitValidation from './inventory-unit.validation';

const router = Router();

/**
 * @swagger
 * /api/inventory-unit:
 *   post:
 *     summary: Create a new inventory unit
 *     tags: [Inventory Unit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryUnit'
 *     responses:
 *       201:
 *         description: The created inventory unit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryUnit'
 */
router.post(
  '/',
  validate(inventoryUnitValidation.createInventoryUnitSchema),
  inventoryUnitController.createInventoryUnit
);

/**
 * @swagger
 * /api/inventory-unit:
 *   get:
 *     summary: Retrieve a list of inventory units
 *     tags: [Inventory Unit]
 *     responses:
 *       200:
 *         description: A list of inventory units.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryUnit'
 */
router.get('/', inventoryUnitController.getAllInventoryUnits);

/**
 * @swagger
 * /api/inventory-unit/{id}:
 *   get:
 *     summary: Retrieve a single inventory unit
 *     tags: [Inventory Unit]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single inventory unit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryUnit'
 */
router.get('/:id', inventoryUnitController.getInventoryUnitById);

/**
 * @swagger
 * /api/inventory-unit/{id}:
 *   patch:
 *     summary: Update an inventory unit
 *     tags: [Inventory Unit]
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
 *             $ref: '#/components/schemas/UpdateInventoryUnit'
 *     responses:
 *       200:
 *         description: The updated inventory unit.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryUnit'
 */
router.patch(
  '/:id',
  validate(inventoryUnitValidation.updateInventoryUnitSchema),
  inventoryUnitController.updateInventoryUnit
);

/**
 * @swagger
 * /api/inventory-unit/{id}:
 *   delete:
 *     summary: Delete an inventory unit
 *     tags: [Inventory Unit]
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
router.delete('/:id', inventoryUnitController.deleteInventoryUnit);

export default router;
