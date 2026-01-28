import { Request, Response } from 'express';
import * as stockRequestService from './stock-request.service';

export const getAllStockRequests = async (req: Request, res: Response) => {
  try {
    const { department, status } = req.query;
    const stockRequests = await stockRequestService.getAllStockRequests(
      department as string | undefined,
      status as string | undefined
    );
    res.status(200).json(stockRequests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createStockRequest = async (req: Request, res: Response) => {
  try {
    const stockRequest = await stockRequestService.createStockRequest(req.body);
    res.status(201).json(stockRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStockRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expect status to be sent in the request body

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedStockRequest = await stockRequestService.updateStockRequestStatus(
      parseInt(id as string),
      status
    );

    res.status(200).json(updatedStockRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
