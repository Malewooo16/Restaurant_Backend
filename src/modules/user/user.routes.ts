import { Router } from 'express';
import * as userController from './user.controller';
import { requirePermission } from '../../middleware/permissions';

/**
 * User routes
 *
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

const router = Router();

// Permission middleware for user routes
const viewUsers = requirePermission('users.view');
const createUsers = requirePermission('users.create');
const editUsers = requirePermission('users.edit');
const deleteUsers = requirePermission('users.delete');
const managePermissions = requirePermission('users.manage_permissions');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.get('/', viewUsers, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

router.get('/:id', viewUsers, userController.getUserById);
router.put('/:id', editUsers, userController.updateUser);
router.delete('/:id', deleteUsers, userController.deleteUser);

/**
 * @swagger
 * /users/{id}/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       200:
 *         description: Password changed successfully
 */

router.post('/:id/change-password', editUsers, userController.changePassword);

/**
 * @swagger
 * /users/{id}/permissions:
 *   get:
 *     summary: Get effective permissions for user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of permission strings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

router.get('/:id/permissions', managePermissions, userController.getEffectivePermissions);

/**
 * @swagger
 * /users/{id}/permissions/{permissionId}:
 *   put:
 *     summary: Update a specific permission for user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserPermission'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 */

router.put('/:id/permissions/:permissionId', managePermissions, userController.updateUserPermission);
router.post('/', createUsers, userController.createUser);

export default router;