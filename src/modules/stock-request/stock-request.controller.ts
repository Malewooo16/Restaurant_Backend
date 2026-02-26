import { Request, Response } from 'express';
import * as stockRequestService from './stock-request.service';
import { AuthRequest } from '../../middleware/auth';

export const getAllStockRequests = async (req: Request, res: Response) => {
  try {
    const { department, status, startDate, endDate } = req.query;
    const stockRequests = await stockRequestService.getAllStockRequests(
      department as string | undefined,
      status as string | undefined,
      startDate as string | undefined,
      endDate as string | undefined
    );
    res.status(200).json(stockRequests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createStockRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const stockRequest = await stockRequestService.createStockRequest(req.body, userId!);
    res.status(201).json(stockRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStockRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expect status to be sent in the request body
    const userId = req.user?.id;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedStockRequest = await stockRequestService.updateStockRequestStatus(
      parseInt(id as string),
      status,
      userId!
    );

    res.status(200).json(updatedStockRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
