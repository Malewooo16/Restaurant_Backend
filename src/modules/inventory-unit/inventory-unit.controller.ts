import { Request, Response } from 'express';
import * as inventoryUnitService from './inventory-unit.service';

export const createInventoryUnit = async (req: Request, res: Response) => {
  try {
    const inventoryUnit = await inventoryUnitService.createInventoryUnit(
      req.body
    );
    res.status(201).json(inventoryUnit);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllInventoryUnits = async (
  req: Request,
  res: Response
) => {
  try {
    const inventoryUnits = await inventoryUnitService.getAllInventoryUnits();
    res.status(200).json(inventoryUnits);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInventoryUnitById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const inventoryUnit = await inventoryUnitService.getInventoryUnitById(
      parseInt(id as string)
    );
    if (!inventoryUnit) {
      return res.status(404).json({ message: 'Inventory unit not found' });
    }
    res.status(200).json(inventoryUnit);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventoryUnit = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const inventoryUnit = await inventoryUnitService.updateInventoryUnit(
      parseInt(id as string),
      req.body
    );
    res.status(200).json(inventoryUnit);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventoryUnit = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await inventoryUnitService.deleteInventoryUnit(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
