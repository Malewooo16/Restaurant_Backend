import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { getDepartmentInventory, updateDepartmentInventory } from './department-inventory.controller';
import { getDepartmentInventorySchema, updateDepartmentInventorySchema } from './department-inventory.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Department Inventory
 *   description: API for managing department-specific inventory
 */

/**
 * @swagger
 * /department-inventory:
 *   get:
 *     summary: Get inventory items by department with their departmental stock
 *     tags: [Department Inventory]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [KITCHEN, BAR, SERVICE, OPERATIONS, MANAGEMENT]
 *         required: true
 *         description: The department to filter inventory by.
 *     responses:
 *       200:
 *         description: A list of inventory items with their stock in the specified department.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DepartmentInventoryItemResponse'
 *       400:
 *         description: Bad request, e.g., missing or invalid department query parameter.
 *       500:
 *         description: Server error.
 */
router.get(
  '/',
  validate(getDepartmentInventorySchema),
  getDepartmentInventory
);

/**
 * @swagger
 * /department-inventory/{departmentInventoryId}:
 *   patch:
 *     summary: Update the stock quantity of a specific department inventory item
 *     tags: [Department Inventory]
 *     parameters:
 *       - in: path
 *         name: departmentInventoryId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the DepartmentInventory record to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentInventoryRequest'
 *     responses:
 *       200:
 *         description: Department inventory item quantity updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentInventoryItemResponse' # Assuming it returns the updated item
 *       400:
 *         description: Bad request, e.g., invalid quantity or parameters.
 *       404:
 *         description: DepartmentInventory record not found.
 *       500:
 *         description: Server error.
 */
router.patch(
  '/:departmentInventoryId',
  validate(updateDepartmentInventorySchema),
  updateDepartmentInventory
);

export default router;
