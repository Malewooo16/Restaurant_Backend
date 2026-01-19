import { Router } from 'express';
import * as inventoryItemController from './inventory-item.controller';
import { validate } from '../../middleware/validate';
import * as inventoryItemValidation from './inventory-item.validation';

const router = Router();

router.post(
  '/',
  validate(inventoryItemValidation.createInventoryItemSchema),
  inventoryItemController.createInventoryItem
);
router.get('/', inventoryItemController.getAllInventoryItems);
router.get('/:id', inventoryItemController.getInventoryItemById);
router.patch(
  '/:id',
  validate(inventoryItemValidation.updateInventoryItemSchema),
  inventoryItemController.updateInventoryItem
);
router.delete('/:id', inventoryItemController.deleteInventoryItem);

export default router;
