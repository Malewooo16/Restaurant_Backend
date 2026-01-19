import { Router } from 'express';
import * as inventoryCategoryController from './inventory-category.controller';
import { validate } from '../../middleware/validate';
import * as inventoryCategoryValidation from './inventory-category.validation';

const router = Router();

router.post(
  '/',
  validate(inventoryCategoryValidation.createInventoryCategorySchema),
  inventoryCategoryController.createInventoryCategory
);
router.get('/', inventoryCategoryController.getAllInventoryCategories);
router.get('/:id', inventoryCategoryController.getInventoryCategoryById);
router.patch(
  '/:id',
  validate(inventoryCategoryValidation.updateInventoryCategorySchema),
  inventoryCategoryController.updateInventoryCategory
);
router.delete('/:id', inventoryCategoryController.deleteInventoryCategory);

export default router;
