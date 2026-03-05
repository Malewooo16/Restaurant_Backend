import { Router } from 'express';
import * as inventoryAdjustmentController from './inventory-adjustment.controller';
import { validate } from '../../middleware/validate';
import { requirePermission } from '../../middleware/permissions';
import * as inventoryAdjustmentValidation from './inventory-adjustment.validation';

// Permission middleware for inventory adjustment routes
const viewAdjustments = requirePermission('inventory.view_adjustments');
const createAdjustments = requirePermission('inventory.create_adjustments');

const router = Router();

/**
 * @swagger
 * /api/inventory-adjustments:
 *   get:
 *     summary: Get all inventory adjustments
 *     tags: [Inventory Adjustment]
 */
router.get('/', viewAdjustments, inventoryAdjustmentController.getAllInventoryAdjustments);

/**
 * @swagger
 * /api/inventory-adjustments:
 *   post:
 *     summary: Create a new inventory adjustment
 *     tags: [Inventory Adjustment]
 */
router.post(
  '/',
  createAdjustments,
  validate(inventoryAdjustmentValidation.createInventoryAdjustmentSchema),
  inventoryAdjustmentController.createInventoryAdjustment
);

/**
 * @swagger
 * /api/inventory-adjustments/{id}:
 *   get:
 *     summary: Get inventory adjustment by ID
 *     tags: [Inventory Adjustment]
 */
router.get('/:id', inventoryAdjustmentController.getInventoryAdjustmentById);

export default router;