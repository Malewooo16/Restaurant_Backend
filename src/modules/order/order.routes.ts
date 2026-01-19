import { Router } from 'express';
import * as orderController from './order.controller';
import { validate } from '../../middleware/validate';
import * as orderValidation from './order.validation';

const router = Router();

router.post(
  '/',
  validate(orderValidation.createOrderSchema),
  orderController.createOrder
);
router.get('/', orderController.getAllOrders);

// Move kitchen and bar routes before the generic :id routes
router.get('/kitchen-orders', orderController.getAllKitchenOrders);
router.get('/bar-orders', orderController.getAllBarOrders);
router.get('/kitchen-orders/:id', orderController.getKitchenOrderById);
router.get('/bar-orders/:id', orderController.getBarOrderById);
router.patch(
  '/kitchen-orders/:id',
  validate(orderValidation.updateKitchenOrderStatusSchema),
  orderController.updateKitchenOrderStatus
);
router.patch(
  '/bar-orders/:id',
  validate(orderValidation.updateBarOrderStatusSchema),
  orderController.updateBarOrderStatus
);

// Generic :id routes should come last
router.get('/:id', orderController.getOrderById);
router.patch(
  '/:id',
  validate(orderValidation.updateOrderSchema),
  orderController.updateOrder
);
router.delete('/:id', orderController.deleteOrder);


export default router;
