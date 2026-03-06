import { Router } from 'express';
import {
  getSetting,
  getAllSettings,
  updateSetting,
  updateSettings,
  deleteSetting,
} from './setting.controller';
import { requirePermission } from '../../middleware/permissions';

const router = Router();

// Permission middleware for settings routes
const viewAlerts = requirePermission('settings.view_alerts');
const editAlerts = requirePermission('settings.edit_alerts');
const viewBusinessInfo = requirePermission('settings.view_business_information');
const editBusinessInfo = requirePermission('settings.edit_business_information');
const viewConfigurations = requirePermission('settings.view_configurations');
const editConfigurations = requirePermission('settings.edit_configurations');

// Map setting keys to their view/edit permissions
const SETTING_PERMISSIONS: Record<string, { view: string; edit: string }> = {
  'alerts': { view: 'settings.view_alerts', edit: 'settings.edit_alerts' },
  'business_info': { view: 'settings.view_business_information', edit: 'settings.edit_business_information' },
  'configurations': { view: 'settings.view_configurations', edit: 'settings.edit_configurations' },
};

// Middleware factory to check permission based on setting key
const checkSettingPermission = (type: 'view' | 'edit') => {
  return (req: any, res: any, next: any) => {
    const key = req.params.key;
    const permission = SETTING_PERMISSIONS[key]?.[type];
    
    if (!permission) {
      // If key not found, deny access
      return res.status(403).json({ error: 'Invalid setting key' });
    }
    
    // Check if user has the required permission
    const hasPermission = req.user?.permissions?.some((p: any) => p.name === permission);
    const isAdmin = req.user?.userGroup?.name === 'Admin';
    
    if (!hasPermission && !isAdmin) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Bulk update middleware - requires edit permission for ALL settings being updated
const checkBulkEditPermission = (req: any, res: any, next: any) => {
  const keys = Object.keys(req.body);
  
  for (const key of keys) {
    const permission = SETTING_PERMISSIONS[key]?.edit;
    if (!permission) {
      return res.status(403).json({ error: `Invalid setting key: ${key}` });
    }
    
    const hasPermission = req.user?.permissions?.some((p: any) => p.name === permission);
    const isAdmin = req.user?.userGroup?.name === 'Admin';
    
    if (!hasPermission && !isAdmin) {
      return res.status(403).json({ error: `Insufficient permissions for: ${key}` });
    }
  }
  
  next();
};

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
router.get('/:key', checkSettingPermission('view'), getSetting);

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
router.put('/:key', checkSettingPermission('edit'), updateSetting);

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
router.put('/', checkBulkEditPermission, updateSettings);

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
router.delete('/:key', checkSettingPermission('edit'), deleteSetting);

export default router;