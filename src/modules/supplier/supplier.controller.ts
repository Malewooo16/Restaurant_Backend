import { Request, Response } from 'express';
import * as supplierService from './supplier.service';
import { AuthRequest } from '../../middleware/auth';

export const createSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const supplier = await supplierService.createSupplier(req.body, userId!);
    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.status(200).json(suppliers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.getSupplierById(parseInt(id as string));
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json(supplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSupplier = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const supplier = await supplierService.updateSupplier(
      parseInt(id as string),
      req.body,
      userId!
    );
    res.status(200).json(supplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await supplierService.deleteSupplier(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
