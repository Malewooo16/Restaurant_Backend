import { Router } from 'express';
import * as userController from './user.controller';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/permissions', userController.getEffectivePermissions);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.put('/:id/permissions/:permissionId', userController.updateUserPermission);
router.delete('/:id', userController.deleteUser);
router.post('/:id/change-password', userController.changePassword);

export default router;