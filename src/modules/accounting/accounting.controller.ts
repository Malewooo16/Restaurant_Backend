import { Request, Response } from 'express';
import * as accountingService from './accounting.service';

export const getAccountingSummary = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const summary = await accountingService.getAccountingSummary(start, end);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const transactions = await accountingService.getRecentTransactions(limit);
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailySummary = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const summary = await accountingService.getDailySummary(days);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseBreakdown = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const breakdown = await accountingService.getExpenseBreakdown(start, end);
    res.json(breakdown);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};