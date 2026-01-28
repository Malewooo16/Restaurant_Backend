import { Request, Response } from 'express';
import * as inventoryItemService from './inventory-item.service';

export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    // Transform flat input to nested Prisma input
    const { categoryId, ...rest } = req.body;
    const data = {
      ...rest,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
    };
    const inventoryItem = await inventoryItemService.createInventoryItem(
      data
    );
    res.status(201).json(inventoryItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInventoryItems = async (
  req: Request,
  res: Response
) => {
  try {
    const inventoryItems = await inventoryItemService.getAllInventoryItems();
    res.status(200).json(inventoryItems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryItemById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const inventoryItem = await inventoryItemService.getInventoryItemById(
      parseInt(id as string)
    );
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json(inventoryItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventoryItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    // Transform flat input to nested Prisma input
    const { categoryId, ...rest } = req.body;
    const data = {
      ...rest,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
    };
    const inventoryItem = await inventoryItemService.updateInventoryItem(
      parseInt(id as string),
      data
    );
    res.status(200).json(inventoryItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventoryItem = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await inventoryItemService.deleteInventoryItem(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
