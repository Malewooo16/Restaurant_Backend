import { Router } from 'express';
import menuRoutes from './menu/menu.routes';
import orderRoutes from './order/order.routes';
import inventoryCategoryRoutes from './inventory-category/inventory-category.routes';
import inventoryUnitRoutes from './inventory-unit/inventory-unit.routes';
import inventoryItemRoutes from './inventory-item/inventory-item.routes';

const router = Router();

router.use('/menu', menuRoutes);
router.use('/order', orderRoutes);
router.use('/inventory-category', inventoryCategoryRoutes);
router.use('/inventory-unit', inventoryUnitRoutes);
router.use('/inventory-item', inventoryItemRoutes);

export default router;
