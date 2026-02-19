import { Request, Response } from 'express';
import * as dissatisfactionService from './dissatisfaction.service';

export const getAllDissatisfactions = async (req: Request, res: Response) => {
  try {
    const dissatisfactions = await dissatisfactionService.getAllDissatisfactions();
    res.json(dissatisfactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDissatisfactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dissatisfactionId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const dissatisfaction = await dissatisfactionService.getDissatisfactionById(dissatisfactionId);
    if (!dissatisfaction) {
      return res.status(404).json({ message: 'Dissatisfaction not found' });
    }
    res.json(dissatisfaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDissatisfaction = async (req: Request, res: Response) => {
  try {
    const dissatisfaction = await dissatisfactionService.createDissatisfaction(req.body);
    res.status(201).json(dissatisfaction);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDissatisfaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dissatisfactionId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const dissatisfaction = await dissatisfactionService.updateDissatisfaction(dissatisfactionId, req.body);
    res.json(dissatisfaction);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDissatisfactionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dissatisfactionId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const { status, resolution } = req.body;
    const dissatisfaction = await dissatisfactionService.updateDissatisfactionStatus(dissatisfactionId, status, resolution);
    res.json(dissatisfaction);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDissatisfaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dissatisfactionId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await dissatisfactionService.deleteDissatisfaction(dissatisfactionId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDissatisfactionsByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const dissatisfactions = await dissatisfactionService.getDissatisfactionsByStatus(status as string);
    res.json(dissatisfactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};