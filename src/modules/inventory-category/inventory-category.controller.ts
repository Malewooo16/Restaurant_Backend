import { Request, Response } from 'express';
import * as inventoryCategoryService from './inventory-category.service';
import { AuthRequest } from '../../middleware/auth';

export const createInventoryCategory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const inventoryCategory = await inventoryCategoryService.createInventoryCategory(
      req.body,
      userId!
    );
    res.status(201).json(inventoryCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInventoryCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const inventoryCategories =
      await inventoryCategoryService.getAllInventoryCategories();
    res.status(200).json(inventoryCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryCategoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const inventoryCategory =
      await inventoryCategoryService.getInventoryCategoryById(
        parseInt(id as string)
      );
    if (!inventoryCategory) {
      return res
        .status(404)
        .json({ message: 'Inventory category not found' });
    }
    res.status(200).json(inventoryCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventoryCategory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const inventoryCategory =
      await inventoryCategoryService.updateInventoryCategory(
        parseInt(id as string),
        req.body,
        userId!
      );
    res.status(200).json(inventoryCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventoryCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await inventoryCategoryService.deleteInventoryCategory(
      parseInt(id as string)
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
