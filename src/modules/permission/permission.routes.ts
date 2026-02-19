import { Router } from 'express';
import * as permissionController from './permission.controller';

const router = Router();

router.get('/', permissionController.getAllPermissions);
router.get('/category/:category', permissionController.getPermissionsByCategory);
router.get('/:id', permissionController.getPermissionById);
router.post('/', permissionController.createPermission);
router.put('/:id', permissionController.updatePermission);
router.delete('/:id', permissionController.deletePermission);

export default router;