import { Router } from 'express';
import * as supplierController from './supplier.controller';
import { validate } from '../../middleware/validate';
import * as supplierValidation from './supplier.validation';

const router = Router();

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
 *             $ref: '#/components/schemas/CreateSupplier'
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
 *                 $ref: '#/components/schemas/Supplier'
 */
router.get('/', supplierController.getAllSuppliers);

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
router.get('/:id', supplierController.getSupplierById);

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
 *             $ref: '#/components/schemas/UpdateSupplier'
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
router.delete('/:id', supplierController.deleteSupplier);

export default router;