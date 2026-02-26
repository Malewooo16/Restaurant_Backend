import { Request, Response } from 'express';
import * as tableService from './table.service';
import { AuthRequest } from '../../middleware/auth';

export const createTable = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const table = await tableService.createTable(
      req.body,
      userId!
    );
    res.status(201).json(table);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTables = async (
  req: Request,
  res: Response
) => {
  try {
    const tables =
      await tableService.getAllTables();
    res.status(200).json(tables);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableTables = async (
  req: Request,
  res: Response
) => {
  try {
    const date = req.query.date as string | undefined;
    const tables =
      await tableService.getAvailableTables(date);
    res.status(200).json(tables);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTableById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const table =
      await tableService.getTableById(
        parseInt(id as string)
      );
    if (!table) {
      return res
        .status(404)
        .json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTable = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const table =
      await tableService.updateTable(
        parseInt(id as string),
        req.body,
        userId!
      );
    res.status(200).json(table);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTable = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await tableService.deleteTable(
      parseInt(id as string)
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
