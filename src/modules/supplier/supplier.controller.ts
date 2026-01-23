import { Request, Response } from 'express';
import * as supplierService from './supplier.service';

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
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

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.updateSupplier(
      parseInt(id as string),
      req.body
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
