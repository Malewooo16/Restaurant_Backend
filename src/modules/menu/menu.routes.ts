import { Router } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
} from './menu.controller';
import { validate } from '../../middleware/validate';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from './menu.validation';

const router = Router();

router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', validate(createMenuItemSchema), createMenuItem);
router.put('/:id', validate(updateMenuItemSchema), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
