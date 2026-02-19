import { Router } from 'express';
import * as userGroupController from './user-group.controller';

const router = Router();

router.get('/', userGroupController.getAllUserGroups);
router.get('/:id', userGroupController.getUserGroupById);
router.post('/', userGroupController.createUserGroup);
router.put('/:id', userGroupController.updateUserGroup);
router.delete('/:id', userGroupController.deleteUserGroup);
router.post('/:id/set-default', userGroupController.setDefaultUserGroup);

export default router;