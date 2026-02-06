import { Request, Response } from 'express';
import * as adjustmentReasonService from './adjustment-reason.service';

export const getAllAdjustmentReasons = async (req: Request, res: Response) => {
  try {
    const reasons = await adjustmentReasonService.getAllAdjustmentReasons();
    res.status(200).json(reasons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdjustmentReason = async (req: Request, res: Response) => {
  try {
    const reason = await adjustmentReasonService.createAdjustmentReason(req.body);
    res.status(201).json(reason);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdjustmentReasonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reason = await adjustmentReasonService.getAdjustmentReasonById(parseInt(id as string));
    if (!reason) {
      return res.status(404).json({ message: 'Adjustment reason not found' });
    }
    res.status(200).json(reason);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdjustmentReason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reason = await adjustmentReasonService.updateAdjustmentReason(
      parseInt(id as string),
      req.body
    );
    res.status(200).json(reason);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdjustmentReason = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adjustmentReasonService.deleteAdjustmentReason(parseInt(id as string));
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};