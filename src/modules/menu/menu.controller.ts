import { Request, Response } from 'express';
import { Prisma } from '../../../generated/prisma/client';
import * as menuService from './menu.service';

export const getAllMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await menuService.getAllMenuItems();
    res.status(200).json(menuItems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuItem = await menuService.getMenuItemById(menuId);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createMenuItem = async (req: Request, res: Response) => {
  try {

    const menuItem = await menuService.createMenuItem(req.body);
    res.status(201).json(menuItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuItem = await menuService.updateMenuItem(
      menuId,
      req.body
    );
    res.status(200).json(menuItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await menuService.deleteMenuItem(menuId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// MenuAddon Controllers
export const createMenuAddon = async (req: Request, res: Response) => {
  try {
    const menuAddon = await menuService.createMenuAddon(req.body);
    res.status(201).json(menuAddon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMenuAddons = async (req: Request, res: Response) => {
  try {
    const menuAddons = await menuService.getAllMenuAddons();
    res.status(200).json(menuAddons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMenuAddonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuAddonId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuAddon = await menuService.getMenuAddonById(menuAddonId);
    if (!menuAddon) {
      return res.status(404).json({ message: 'Menu addon not found' });
    }
    res.status(200).json(menuAddon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuAddon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuAddonId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuAddon = await menuService.updateMenuAddon(
      menuAddonId,
      req.body
    );
    res.status(200).json(menuAddon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuAddon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuAddonId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await menuService.deleteMenuAddon(menuAddonId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// MenuSideDish Controllers
export const createMenuSideDish = async (req: Request, res: Response) => {
  try {
    const menuSideDish = await menuService.createMenuSideDish(req.body);
    res.status(201).json(menuSideDish);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMenuSideDishes = async (req: Request, res: Response) => {
  try {
    const menuSideDishes = await menuService.getAllMenuSideDishes();
    res.status(200).json(menuSideDishes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMenuSideDishById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuSideDishId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuSideDish = await menuService.getMenuSideDishById(menuSideDishId);
    if (!menuSideDish) {
      return res.status(404).json({ message: 'Menu side dish not found' });
    }
    res.status(200).json(menuSideDish);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuSideDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuSideDishId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuSideDish = await menuService.updateMenuSideDish(
      menuSideDishId,
      req.body
    );
    res.status(200).json(menuSideDish);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuSideDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuSideDishId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await menuService.deleteMenuSideDish(menuSideDishId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// MenuCategory Controllers
export const createMenuCategory = async (req: Request, res: Response) => {
  try {
    const menuCategory = await menuService.createMenuCategory(req.body);
    res.status(201).json(menuCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMenuCategories = async (req: Request, res: Response) => {
  try {
    const menuCategories = await menuService.getAllMenuCategories();
    res.status(200).json(menuCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMenuCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuCategoryId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuCategory = await menuService.getMenuCategoryById(menuCategoryId);
    if (!menuCategory) {
      return res.status(404).json({ message: 'Menu category not found' });
    }
    res.status(200).json(menuCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuCategoryId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const menuCategory = await menuService.updateMenuCategory(
      menuCategoryId,
      req.body
    );
    res.status(200).json(menuCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const menuCategoryId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await menuService.deleteMenuCategory(menuCategoryId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
