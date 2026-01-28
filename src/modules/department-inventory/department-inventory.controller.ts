import { Request, Response } from 'express';
import { getDepartmentInventoryItems, updateDepartmentInventoryQuantity } from './department-inventory.service';
import { getDepartmentInventorySchema, updateDepartmentInventorySchema } from './department-inventory.validation';

export const getDepartmentInventory = async (req: Request, res: Response) => {
  try {
    // department is now required for the GET route
    const { department } = getDepartmentInventorySchema.parse({ query: req.query }).query;
    const items = await getDepartmentInventoryItems(department);
    res.status(200).json(items);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDepartmentInventory = async (req: Request, res: Response) => {
  try {
    const { departmentInventoryId } = updateDepartmentInventorySchema.parse({ params: req.params }).params;
    const { quantity } = updateDepartmentInventorySchema.parse({ body: req.body }).body;

    const updatedItem = await updateDepartmentInventoryQuantity(
      departmentInventoryId,
      quantity
    );
    res.status(200).json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};