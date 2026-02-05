import { Request, Response } from 'express';
import * as goodsReceivingService from './goods-receiving.service';
import { validateGoodsReceivingItems } from './goods-receiving.validation'; 

export const createGoodsReceiving = async (req: Request, res: Response) => {
  try {
    const { receivedItems, ...goodsReceivingData } = req.body;
    await validateGoodsReceivingItems.parseAsync(receivedItems);
    const goodsReceiving = await goodsReceivingService.createGoodsReceiving(goodsReceivingData, receivedItems);
    res.status(201).json(goodsReceiving);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGoodsReceiving = async (req: Request, res: Response) => {
  try {
    const goodsReceivingRecords = await goodsReceivingService.getAllGoodsReceiving();
    res.status(200).json(goodsReceivingRecords);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGoodsReceivingByPurchaseOrderId = async (req: Request, res: Response) => {
  try {
    const { purchaseOrderId } = req.params;
    const poId = Array.isArray(purchaseOrderId) ? parseInt(purchaseOrderId[0]) : parseInt(purchaseOrderId);
    const goodsReceivingRecords = await goodsReceivingService.getGoodsReceivingByPurchaseOrderId(poId);
    res.status(200).json(goodsReceivingRecords);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getGoodsReceivingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goodsReceiving = await goodsReceivingService.getGoodsReceivingById(parseInt(id as string));
    if (!goodsReceiving) {
      return res.status(404).json({ message: 'Goods receiving record not found' });
    }
    res.status(200).json(goodsReceiving);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGoodsReceiving = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { receivedItems, ...goodsReceivingData } = req.body;
    await validateGoodsReceivingItems.parseAsync(receivedItems);
    const goodsReceiving = await goodsReceivingService.updateGoodsReceiving(
      parseInt(id as string),
      goodsReceivingData,
      receivedItems
    );
    res.status(200).json(goodsReceiving);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGoodsReceiving = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await goodsReceivingService.deleteGoodsReceiving(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
