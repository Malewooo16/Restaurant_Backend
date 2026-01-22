import { Router } from 'express';
import * as orderController from './order.controller';
import { validate } from '../../middleware/validate';
import * as orderValidation from './order.validation';

const router = Router();

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new customer order, including order items with optional side dishes and addons. This operation also automatically generates associated kitchen and bar orders based on the order items' prep areas.
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: The created order, including its associated order items, kitchen order (if applicable), and bar order (if applicable).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post(
  '/',
  validate(orderValidation.createOrderSchema),
  orderController.createOrder
);

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', orderController.getAllOrders);

/**
 * @swagger
 * /api/order/recent:
 *   get:
 *     summary: Retrieve a list of recent orders (not paid or cancelled)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of recent orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/recent', orderController.getRecentOrders);

/**
 * @swagger
 * /api/order/kitchen-orders:
 *   get:
 *     summary: Retrieve a list of current kitchen orders (parent order not paid or cancelled)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of current kitchen orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KitchenOrder'
 */
router.get('/kitchen-orders', orderController.getAllKitchenOrders);

/**
 * @swagger
 * /api/order/kitchen-orders-with-details:
 *   get:
 *     summary: Retrieve a list of current kitchen orders with detailed menu item information including sides and addons
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of current kitchen orders with detailed menu item information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/KitchenOrderWithDetails'
 */
router.get('/kitchen-orders-with-details', orderController.getAllKitchenOrdersWithDetails);

/**
 * @swagger
 * /api/order/bar-orders:
 *   get:
 *     summary: Retrieve a list of current bar orders (parent order not paid or cancelled)
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of current bar orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BarOrder'
 */
router.get('/bar-orders', orderController.getAllBarOrders);

/**
 * @swagger
 * /api/order/kitchen-orders/{id}:
 *   get:
 *     summary: Retrieve a single kitchen order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single kitchen order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KitchenOrder'
 */
router.get('/kitchen-orders/:id', orderController.getKitchenOrderById);

/**
 * @swagger
 * /api/order/bar-orders/{id}:
 *   get:
 *     summary: Retrieve a single bar order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single bar order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BarOrder'
 */
router.get('/bar-orders/:id', orderController.getBarOrderById);

/**
 * @swagger
 * /api/order/kitchen-orders/{id}:
 *   patch:
 *     summary: Update a kitchen order status
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateKitchenOrderStatus'
 *     responses:
 *       200:
 *         description: The updated kitchen order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KitchenOrder'
 */
router.patch(
  '/kitchen-orders/:id',
  validate(orderValidation.updateKitchenOrderStatusSchema),
  orderController.updateKitchenOrderStatus
);

/**
 * @swagger
 * /api/order/bar-orders/{id}:
 *   patch:
 *     summary: Update a bar order status
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBarOrderStatus'
 *     responses:
 *       200:
 *         description: The updated bar order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BarOrder'
 */
router.patch(
  '/bar-orders/:id',
  validate(orderValidation.updateBarOrderStatusSchema),
  orderController.updateBarOrderStatus
);

/**
 * @swagger
 * /api/order/order-items/{id}:
 *   patch:
 *     summary: Update an order item status
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderItemStatus'
 *     responses:
 *       200:
 *         description: The updated order item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 */
router.patch(
  '/order-items/:id',
  validate(orderValidation.updateOrderItemStatusSchema),
  orderController.updateOrderItemStatus
);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Retrieve a single order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single order.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /api/order/{id}:
 *   patch:
 *     summary: Update an order
 *     description: Updates an existing customer order. This operation allows for modifying basic order details (e.g., tableNumber, customerName, waiter) and replacing all associated order items. When 'orderItems' are provided, existing items for the order are removed and new ones are created, along with updating or recreating associated kitchen and bar orders based on the new items' prep areas.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrder'
 *     responses:
 *       200:
 *         description: The fully updated order, including its new order items, kitchen order (if applicable), and bar order (if applicable).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.patch(
  '/:id',
  validate(orderValidation.updateOrderSchema),
  orderController.updateOrder
);

/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 */
router.delete('/:id', orderController.deleteOrder);


export default router;
