import { Request, Response } from 'express';
import { getDepartmentInventoryItems, updateDepartmentInventoryQuantity } from './department-inventory.service';
import { getDepartmentInventorySchema, updateDepartmentInventorySchema } from './department-inventory.validation';
import { AuthRequest } from '../../middleware/auth';

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

export const updateDepartmentInventory = async (req: AuthRequest, res: Response) => {
  try {
    const departmentInventoryId = parseInt(req.params.departmentInventoryId as string, 10);
    const { quantity } = updateDepartmentInventorySchema.parse({ body: req.body }).body;
    const userId = req.user?.id;

    const updatedItem = await updateDepartmentInventoryQuantity(
      departmentInventoryId,
      quantity,
      userId!
    );
    res.status(200).json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};