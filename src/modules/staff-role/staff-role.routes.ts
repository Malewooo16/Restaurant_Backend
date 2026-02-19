import { Router } from 'express';
import {
  getAllStaffRoles,
  getStaffRoleById,
  getStaffRolesByDepartment,
  createStaffRole,
  updateStaffRole,
  deleteStaffRole,
} from './staff-role.controller';

const router = Router();

/**
 * @swagger
 * /api/staff-roles:
 *   get:
 *     summary: Retrieve a list of staff roles
 *     tags: [Staff Roles]
 *     responses:
 *       200:
 *         description: A list of staff roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffRole'
 */
router.get('/', getAllStaffRoles);

/**
 * @swagger
 * /api/staff-roles/department/{departmentId}:
 *   get:
 *     summary: Retrieve staff roles by department
 *     tags: [Staff Roles]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of staff roles for the department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StaffRole'
 */
router.get('/department/:departmentId', getStaffRolesByDepartment);

/**
 * @swagger
 * /api/staff-roles/{id}:
 *   get:
 *     summary: Retrieve a single staff role
 *     tags: [Staff Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single staff role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffRole'
 */
router.get('/:id', getStaffRoleById);

/**
 * @swagger
 * /api/staff-roles:
 *   post:
 *     summary: Create a new staff role
 *     tags: [Staff Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffRole'
 *     responses:
 *       201:
 *         description: The created staff role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffRole'
 */
router.post('/', createStaffRole);

/**
 * @swagger
 * /api/staff-roles/{id}:
 *   put:
 *     summary: Update a staff role
 *     tags: [Staff Roles]
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
 *             $ref: '#/components/schemas/StaffRole'
 *     responses:
 *       200:
 *         description: The updated staff role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffRole'
 */
router.put('/:id', updateStaffRole);

/**
 * @swagger
 * /api/staff-roles/{id}:
 *   delete:
 *     summary: Delete a staff role
 *     tags: [Staff Roles]
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
router.delete('/:id', deleteStaffRole);

export default router;