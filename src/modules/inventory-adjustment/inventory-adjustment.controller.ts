import { Request, Response } from 'express';
import * as inventoryAdjustmentService from './inventory-adjustment.service';

export const getAllInventoryAdjustments = async (req: Request, res: Response) => {
  try {
    const { inventoryItemId, batchId } = req.query;
    const adjustments = await inventoryAdjustmentService.getAllInventoryAdjustments(
      inventoryItemId ? parseInt(inventoryItemId as string) : undefined,
      batchId ? parseInt(batchId as string) : undefined
    );
    res.status(200).json(adjustments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createInventoryAdjustment = async (req: Request, res: Response) => {
  try {
    const adjustment = await inventoryAdjustmentService.createInventoryAdjustment(req.body);
    res.status(201).json(adjustment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryAdjustmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adjustment = await inventoryAdjustmentService.getInventoryAdjustmentById(parseInt(id as string));
    if (!adjustment) {
      return res.status(404).json({ message: 'Inventory adjustment not found' });
    }
    res.status(200).json(adjustment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};