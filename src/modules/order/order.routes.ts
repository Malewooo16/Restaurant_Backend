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
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrder'
 *     responses:
 *       201:
 *         description: The created order.
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
 * /api/order/kitchen-orders:
 *   get:
 *     summary: Retrieve a list of kitchen orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of kitchen orders.
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
 * /api/order/bar-orders:
 *   get:
 *     summary: Retrieve a list of bar orders
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of bar orders.
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
 *         description: The updated order.
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
