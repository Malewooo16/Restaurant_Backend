import { Request, Response } from 'express';
import * as barReturnService from './bar-return.service';

export const getAllBarReturns = async (req: Request, res: Response) => {
  try {
    const barReturns = await barReturnService.getAllBarReturns();
    res.json(barReturns);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBarReturnById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barReturnId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const barReturn = await barReturnService.getBarReturnById(barReturnId);
    if (!barReturn) {
      return res.status(404).json({ message: 'Bar return not found' });
    }
    res.json(barReturn);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBarReturn = async (req: Request, res: Response) => {
  try {
    const barReturn = await barReturnService.createBarReturn(req.body);
    res.status(201).json(barReturn);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBarReturn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barReturnId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const barReturn = await barReturnService.updateBarReturn(barReturnId, req.body);
    res.json(barReturn);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBarReturnStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barReturnId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const { status, resolution } = req.body;
    const barReturn = await barReturnService.updateBarReturnStatus(barReturnId, status, resolution);
    res.json(barReturn);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBarReturn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const barReturnId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await barReturnService.deleteBarReturn(barReturnId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBarReturnsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const barReturns = await barReturnService.getBarReturnsByStatus(status as string);
    res.json(barReturns);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};