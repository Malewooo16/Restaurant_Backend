import { Router } from 'express';
import * as supplierController from './supplier.controller';
import { validate } from '../../middleware/validate';
import { requirePermission } from '../../middleware/permissions';
import * as supplierValidation from './supplier.validation';

const router = Router();

// Permission middleware for supplier routes
const viewSuppliers = requirePermission('purchases.view_suppliers');
const createSuppliers = requirePermission('purchases.add_suppliers');
const editSuppliers = requirePermission('purchases.edit_suppliers');
const deleteSuppliers = requirePermission('purchases.delete_suppliers');

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Supplier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the supplier
 *               contactPerson:
 *                 type: string
 *                 description: Contact person at the supplier
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the supplier
 *               phone:
 *                 type: string
 *                 description: Phone number of the supplier
 *               address:
 *                 type: string
 *                 description: Physical address of the supplier
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of inventory category IDs associated with this supplier
 *     responses:
 *       201:
 *         description: The created supplier.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 */
router.post(
  '/',
  createSuppliers,
  validate(supplierValidation.createSupplierSchema),
  supplierController.createSupplier
);

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Supplier]
 *     responses:
 *       200:
 *         description: A list of suppliers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   contactPerson:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   inventoryCategories:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 */
router.get('/', viewSuppliers, supplierController.getAllSuppliers);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get a supplier by ID
 *     tags: [Supplier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The supplier with the specified ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found.
 */
router.get('/:id', viewSuppliers, supplierController.getSupplierById);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   patch:
 *     summary: Update a supplier by ID
 *     tags: [Supplier]
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the supplier
 *               contactPerson:
 *                 type: string
 *                 description: Contact person at the supplier
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the supplier
 *               phone:
 *                 type: string
 *                 description: Phone number of the supplier
 *               address:
 *                 type: string
 *                 description: Physical address of the supplier
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of inventory category IDs to associate with this supplier
 *     responses:
 *       200:
 *         description: The updated supplier.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       404:
 *         description: Supplier not found.
 */
router.patch(
  '/:id',
  editSuppliers,
  validate(supplierValidation.updateSupplierSchema),
  supplierController.updateSupplier
);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete a supplier by ID
 *     tags: [Supplier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supplier deleted successfully.
 *       404:
 *         description: Supplier not found.
 */
router.delete('/:id', deleteSuppliers, supplierController.deleteSupplier);

export default router;