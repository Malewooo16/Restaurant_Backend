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
