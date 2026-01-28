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
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - categoryId
 *                 - unit
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the inventory item
 *                 description:
 *                   type: string
 *                   description: Description of the inventory item
 *                 sku:
 *                   type: string
 *                   description: Stock Keeping Unit for the item
 *                 categoryId:
 *                   type: integer
 *                   description: ID of the inventory category
 *                 unit:
 *                   type: string
 *                   description: Unit of measurement for the item
 *                 quantity:
 *                   type: number
 *                   format: float
 *                   description: Current quantity in stock
 *                 minStock:
 *                   type: number
 *                   format: float
 *                   description: Minimum stock level before reorder
 *                 maxStock:
 *                   type: number
 *                   format: float
 *                   description: Maximum stock level
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: Purchase price of the item
 *                 supplier:
 *                   type: string
 *                   description: Supplier of the item
 *                 location:
 *                   type: string
 *                   enum: [KITCHEN, BAR, STORAGE, WALKIN_COOLER, FREEZER, DRY_STORAGE]
 *                   description: Storage location of the item
 *                 storageLocation:
 *                   type: string
 *                   description: Specific storage location details
 *                 department:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [KITCHEN, BAR, SERVICE, OPERATIONS, MANAGEMENT]
 *                   description: Array of departments this item belongs to
 *
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   sku:
 *                     type: string
 *                   categoryId:
 *                     type: integer
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                   unit:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   minStock:
 *                     type: number
 *                   maxStock:
 *                     type: number
 *                   price:
 *                     type: number
 *                   supplier:
 *                     type: string
 *                   location:
 *                     type: string
 *                   storageLocation:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   department:
 *                     type: array
 *                     items:
 *                       type: string
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 sku:
 *                   type: string
 *                 categoryId:
 *                   type: integer
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                 unit:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 minStock:
 *                   type: number
 *                 maxStock:
 *                   type: number
 *                 price:
 *                   type: number
 *                 supplier:
 *                   type: string
 *                 location:
 *                   type: string
 *                 storageLocation:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
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
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the inventory item
 *                 description:
 *                   type: string
 *                   description: Description of the inventory item
 *                 sku:
 *                   type: string
 *                   description: Stock Keeping Unit for the item
 *                 categoryId:
 *                   type: integer
 *                   description: ID of the inventory category
 *                 unit:
 *                   type: string
 *                   description: Unit of measurement for the item
 *                 quantity:
 *                   type: number
 *                   format: float
 *                   description: Current quantity in stock
 *                 minStock:
 *                   type: number
 *                   format: float
 *                   description: Minimum stock level before reorder
 *                 maxStock:
 *                   type: number
 *                   format: float
 *                   description: Maximum stock level
 *                 price:
 *                   type: number
 *                   format: float
 *                   description: Purchase price of the item
 *                 supplier:
 *                   type: string
 *                   description: Supplier of the item
 *                 location:
 *                   type: string
 *                   enum: [KITCHEN, BAR, STORAGE, WALKIN_COOLER, FREEZER, DRY_STORAGE]
 *                   description: Storage location of the item
 *                 storageLocation:
 *                   type: string
 *                   description: Specific storage location details
 *                 status:
 *                   type: string
 *                   enum: [NORMAL, LOW, CRITICAL]
 *                   description: Current stock status
 *                 department:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [KITCHEN, BAR, SERVICE, OPERATIONS, MANAGEMENT]
 *                   description: Array of departments this item belongs to
 *
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
