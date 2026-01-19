import { Router } from 'express';
import * as inventoryUnitController from './inventory-unit.controller';
import { validate } from '../../middleware/validate';
import * as inventoryUnitValidation from './inventory-unit.validation';

const router = Router();

router.post(
  '/',
  validate(inventoryUnitValidation.createInventoryUnitSchema),
  inventoryUnitController.createInventoryUnit
);
router.get('/', inventoryUnitController.getAllInventoryUnits);
router.get('/:id', inventoryUnitController.getInventoryUnitById);
router.patch(
  '/:id',
  validate(inventoryUnitValidation.updateInventoryUnitSchema),
  inventoryUnitController.updateInventoryUnit
);
router.delete('/:id', inventoryUnitController.deleteInventoryUnit);

export default router;
