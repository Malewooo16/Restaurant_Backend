import { Router } from 'express';
import stockRequestRoutes from './stock-request/stock-request.routes';
import menuRoutes from './menu/menu.routes';
import orderRoutes from './order/order.routes';
import inventoryCategoryRoutes from './inventory-category/inventory-category.routes';
import inventoryUnitRoutes from './inventory-unit/inventory-unit.routes';
import inventoryItemRoutes from './inventory-item/inventory-item.routes';
import supplierRoutes from './supplier/supplier.routes';
import purchaseOrderRoutes from './purchase-order/purchase-order.routes';
import goodsReceivingRoutes from './goods-receiving/goods-receiving.routes';
import batchRoutes from './batch/batch.routes'; // New
import departmentInventoryRoutes from './department-inventory/department-inventory.routes'; // New

const router = Router();

router.use('/menu', menuRoutes);
router.use('/order', orderRoutes);
router.use('/inventory-category', inventoryCategoryRoutes);
router.use('/inventory-unit', inventoryUnitRoutes);
router.use('/inventory-item', inventoryItemRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/goods-receiving', goodsReceivingRoutes);
router.use('/batches', batchRoutes); // New
router.use('/department-inventory', departmentInventoryRoutes); // New
router.use('/stock-request', stockRequestRoutes);

export default router;
