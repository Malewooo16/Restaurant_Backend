import { Router } from 'express';
import * as tableController from './table.controller';
import { validate } from '../../middleware/validate';
import * as tableValidation from './table.validation';

const router = Router();

/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Table]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTable'
 *     responses:
 *       201:
 *         description: The created table.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 */
router.post(
  '/',
  validate(tableValidation.createTableSchema),
  tableController.createTable
);

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Retrieve a list of tables
 *     tags: [Table]
 *     responses:
 *       200:
 *         description: A list of tables.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 */
router.get('/', tableController.getAllTables);

/**
 * @swagger
 * /api/tables/available:
 *   get:
 *     summary: Retrieve available tables with reservation due timestamp
 *     description: Returns tables with status AVAILABLE, including upcoming reservation times (30 min before reservation)
 *     tags: [Table]
 *     responses:
 *       200:
 *         description: A list of available tables with reservation due times.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   number:
 *                     type: integer
 *                   capacity:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   reservationDue:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     description: 30 minutes before the next reservation, null if no upcoming reservation
 */
router.get('/available', tableController.getAvailableTables);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Retrieve a single table
 *     tags: [Table]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single table.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 */
router.get('/:id', tableController.getTableById);

/**
 * @swagger
 * /api/tables/{id}:
 *   patch:
 *     summary: Update a table
 *     tags: [Table]
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
 *             $ref: '#/components/schemas/UpdateTable'
 *     responses:
 *       200:
 *         description: The updated table.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 */
router.patch(
  '/:id',
  validate(tableValidation.updateTableSchema),
  tableController.updateTable
);

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     summary: Delete a table
 *     tags: [Table]
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
router.delete('/:id', tableController.deleteTable);

export default router;
