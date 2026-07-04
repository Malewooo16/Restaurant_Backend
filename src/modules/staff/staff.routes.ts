import { Router } from 'express';
import {
  getAllStaff,
  getWaiters,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  uploadStaffImage,
} from './staff.controller';
import { requirePermission } from '../../middleware/permissions';
import upload from '../../config/multer';

const router = Router();

// Permission middleware for staff routes
const viewStaff = requirePermission('staff.view');
const createStaffPerm = requirePermission('staff.create');
const editStaff = requirePermission('staff.edit');
const deleteStaffPerm = requirePermission('staff.delete');

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: Retrieve a list of all staff members
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: A list of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 */
router.get('/', viewStaff, getAllStaff);

/**
 * @swagger
 * /api/staff/waiters:
 *   get:
 *     summary: Retrieve all active waiters
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: A list of waiters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 */
router.get('/waiters', viewStaff, getWaiters);

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Retrieve a single staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single staff member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 */
router.get('/:id', viewStaff, getStaffById);

/**
 * @swagger
 * /api/staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: The created staff member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 */
router.post('/', createStaffPerm, createStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   put:
 *     summary: Update a staff member
 *     tags: [Staff]
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
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       200:
 *         description: The updated staff member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 */
router.put('/:id', editStaff, updateStaff);

/**
 * @swagger
 * /api/staff/{id}:
 *   delete:
 *     summary: Delete a staff member
 *     tags: [Staff]
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
router.delete('/:id', deleteStaffPerm, deleteStaff);

/**
 * @swagger
 * /api/staff/upload:
 *   post:
 *     summary: Upload a staff member image
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The uploaded image URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 */
router.post('/upload', editStaff, upload.single('image'), uploadStaffImage);

export default router;