import { Router } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  createMenuAddon,
  getAllMenuAddons,
  getMenuAddonById,
  updateMenuAddon,
  deleteMenuAddon,
  createMenuSideDish,
  getAllMenuSideDishes,
  getMenuSideDishById,
  updateMenuSideDish,
  deleteMenuSideDish,
  createMenuCategory,
  getAllMenuCategories,
  getMenuCategoryById,
  updateMenuCategory,
  deleteMenuCategory,
} from './menu.controller';
import { validate } from '../../middleware/validate';
import { requirePermission } from '../../middleware/permissions';
import {
  createMenuItemSchema,
  updateMenuItemSchema,
  createMenuAddonSchema,
  updateMenuAddonSchema,
  createMenuSideDishSchema,
  updateMenuSideDishSchema,
  createMenuCategorySchema,
  updateMenuCategorySchema,
} from './menu.validation';

const router = Router();

// Permission middleware for menu routes
const viewMenu = requirePermission({ any: ['menu.view', 'kitchen.view_menu', 'bar.view_menu'] });
const createMenu = requirePermission({ any: ['kitchen.menu_create', 'bar.menu_create'] });
const editMenu = requirePermission({ any: ['kitchen.menu_edit', 'bar.menu_edit'] });
const deleteMenu = requirePermission({ any: ['kitchen.menu_delete', 'bar.menu_delete'] });

/**
 * @swagger
 * /api/menu/menu-items:
 *   get:
 *     summary: Retrieve a list of menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */
router.get('/menu-items', viewMenu, getAllMenuItems);

/**
 * @swagger
 * /api/menu/menu-items/{id}:
 *   get:
 *     summary: Retrieve a single menu item
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single menu item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
router.get('/menu-items/:id', viewMenu, getMenuItemById);

/**
 * @swagger
 * /api/menu/menu-items:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuItem'
 *     responses:
 *       201:
 *         description: The created menu item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
router.post('/menu-items', createMenu, validate(createMenuItemSchema), createMenuItem);

/**
 * @swagger
 * /api/menu/menu-items/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
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
 *             $ref: '#/components/schemas/UpdateMenuItem'
 *     responses:
 *       200:
 *         description: The updated menu item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
router.put('/menu-items/:id', editMenu, validate(updateMenuItemSchema), updateMenuItem);

/**
 * @swagger
 * /api/menu/menu-items/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
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
router.delete('/menu-items/:id', deleteMenu, deleteMenuItem);

/**
 * @swagger
 * /api/menu/menu-items/{id}:
 *   patch:
 *     summary: Partial update a menu item
 *     tags: [Menu]
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
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated menu item.
 */
router.patch('/menu-items/:id', editMenu, updateMenuItem);

// MenuAddon Routes
/**
 * @swagger
 * /api/menu/addons:
 *   post:
 *     summary: Create a new menu addon
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuAddon'
 *     responses:
 *       201:
 *         description: The created menu addon.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuAddon'
 */
router.post('/addons', createMenu, validate(createMenuAddonSchema), createMenuAddon);

/**
 * @swagger
 * /api/menu/addons:
 *   get:
 *     summary: Retrieve a list of menu addons
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu addons.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuAddon'
 */
router.get('/addons', viewMenu, getAllMenuAddons);

/**
 * @swagger
 * /api/menu/addons/{id}:
 *   get:
 *     summary: Retrieve a single menu addon
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single menu addon.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuAddon'
 */
router.get('/addons/:id', viewMenu, getMenuAddonById);

/**
 * @swagger
 * /api/menu/addons/{id}:
 *   put:
 *     summary: Update a menu addon
 *     tags: [Menu]
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
 *             $ref: '#/components/schemas/UpdateMenuAddon'
 *     responses:
 *       200:
 *         description: The updated menu addon.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuAddon'
 */
router.put('/addons/:id', editMenu, validate(updateMenuAddonSchema), updateMenuAddon);

/**
 * @swagger
 * /api/menu/addons/{id}:
 *   delete:
 *     summary: Delete a menu addon
 *     tags: [Menu]
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
router.delete('/addons/:id', deleteMenu, deleteMenuAddon);

/**
 * @swagger
 * /api/menu/addons/{id}:
 *   patch:
 *     summary: Partial update a menu addon
 *     tags: [Menu]
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
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated menu addon.
 */
router.patch('/addons/:id', editMenu, updateMenuAddon);

// MenuSideDish Routes
/**
 * @swagger
 * /api/menu/side-dishes:
 *   post:
 *     summary: Create a new menu side dish
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuSideDish'
 *     responses:
 *       201:
 *         description: The created menu side dish.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuSideDish'
 */
router.post('/side-dishes', createMenu, validate(createMenuSideDishSchema), createMenuSideDish);

/**
 * @swagger
 * /api/menu/side-dishes:
 *   get:
 *     summary: Retrieve a list of menu side dishes
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu side dishes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuSideDish'
 */
router.get('/side-dishes', viewMenu, getAllMenuSideDishes);

/**
 * @swagger
 * /api/menu/side-dishes/{id}:
 *   get:
 *     summary: Retrieve a single menu side dish
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single menu side dish.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuSideDish'
 */
router.get('/side-dishes/:id', viewMenu, getMenuSideDishById);

/**
 * @swagger
 * /api/menu/side-dishes/{id}:
 *   put:
 *     summary: Update a menu side dish
 *     tags: [Menu]
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
 *             $ref: '#/components/schemas/UpdateMenuSideDish'
 *     responses:
 *       200:
 *         description: The updated menu side dish.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuSideDish'
 */
router.put('/side-dishes/:id', editMenu, validate(updateMenuSideDishSchema), updateMenuSideDish);

/**
 * @swagger
 * /api/menu/side-dishes/{id}:
 *   delete:
 *     summary: Delete a menu side dish
 *     tags: [Menu]
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
router.delete('/side-dishes/:id', deleteMenu, deleteMenuSideDish);

/**
 * @swagger
 * /api/menu/side-dishes/{id}:
 *   patch:
 *     summary: Partial update a menu side dish
 *     tags: [Menu]
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
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated menu side dish.
 */
router.patch('/side-dishes/:id', editMenu, updateMenuSideDish);

// MenuCategory Routes
/**
 * @swagger
 * /api/menu/categories:
 *   post:
 *     summary: Create a new menu category
 *     tags: [Menu]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuCategory'
 *     responses:
 *       201:
 *         description: The created menu category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuCategory'
 */
router.post('/categories', createMenu, validate(createMenuCategorySchema), createMenuCategory);

/**
 * @swagger
 * /api/menu/categories:
 *   get:
 *     summary: Retrieve a list of menu categories
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuCategory'
 */
router.get('/categories', viewMenu, getAllMenuCategories);

/**
 * @swagger
 * /api/menu/categories/{id}:
 *   get:
 *     summary: Retrieve a single menu category
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single menu category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuCategory'
 */
router.get('/categories/:id', viewMenu, getMenuCategoryById);

/**
 * @swagger
 * /api/menu/categories/{id}:
 *   put:
 *     summary: Update a menu category
 *     tags: [Menu]
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
 *             $ref: '#/components/schemas/UpdateMenuCategory'
 *     responses:
 *       200:
 *         description: The updated menu category.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuCategory'
 */
router.put('/categories/:id', editMenu, validate(updateMenuCategorySchema), updateMenuCategory);

/**
 * @swagger
 * /api/menu/categories/{id}:
 *   delete:
 *     summary: Delete a menu category
 *     tags: [Menu]
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
router.delete('/categories/:id', deleteMenu, deleteMenuCategory);


export default router;

