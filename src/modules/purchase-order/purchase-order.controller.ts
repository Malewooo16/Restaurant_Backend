import { Request, Response } from 'express';
import * as purchaseOrderService from './purchase-order.service';
import { validatePurchaseOrderItems } from './purchase-order.validation'; 

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { items, ...purchaseOrderData } = req.body;
    await validatePurchaseOrderItems.parseAsync(items);
    const purchaseOrder = await purchaseOrderService.createPurchaseOrder(purchaseOrderData, items);
    res.status(201).json(purchaseOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const purchaseOrders = await purchaseOrderService.getAllPurchaseOrders();
    res.status(200).json(purchaseOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(parseInt(id as string));
    if (!purchaseOrder) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    res.status(200).json(purchaseOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { items, ...purchaseOrderData } = req.body;
    await validatePurchaseOrderItems.parseAsync(items);
    const purchaseOrder = await purchaseOrderService.updatePurchaseOrder(
      parseInt(id as string),
      purchaseOrderData,
      items
    );
    res.status(200).json(purchaseOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await purchaseOrderService.deletePurchaseOrder(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
