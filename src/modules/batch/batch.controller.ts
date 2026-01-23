import { Request, Response } from 'express';
import * as batchService from './batch.service';

export const createBatch = async (req: Request, res: Response) => {
  try {
    const batch = await batchService.createBatch(req.body);
    res.status(201).json(batch);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBatches = async (req: Request, res: Response) => {
  try {
    const batches = await batchService.getAllBatches();
    res.status(200).json(batches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpiringBatches = async (req: Request, res: Response) => {
  try {
    const expiringBatches = await batchService.getExpiringBatches(10); // 10 days as requested
    res.status(200).json(expiringBatches);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const batch = await batchService.getBatchById(parseInt(id as string));
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json(batch);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const batch = await batchService.updateBatch(
      parseInt(id as string),
      req.body
    );
    res.status(200).json(batch);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await batchService.deleteBatch(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
