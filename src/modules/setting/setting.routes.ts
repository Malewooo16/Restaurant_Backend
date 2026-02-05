import { Router } from 'express';
import {
  getSetting,
  getAllSettings,
  updateSetting,
  updateSettings,
  deleteSetting,
} from './setting.controller';

const router = Router();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Retrieve all settings as key-value pairs
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: All settings
 */
router.get('/', getAllSettings);

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     summary: Retrieve a single setting by key
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single setting
 */
router.get('/:key', getSetting);

/**
 * @swagger
 * /api/settings/{key}:
 *   put:
 *     summary: Update a setting by key
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated setting
 */
router.put('/:key', updateSetting);

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update multiple settings at once
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *     responses:
 *       200:
 *         description: Updated settings
 */
router.put('/', updateSettings);

/**
 * @swagger
 * /api/settings/{key}:
 *   delete:
 *     summary: Delete a setting by key
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:key', deleteSetting);

export default router;