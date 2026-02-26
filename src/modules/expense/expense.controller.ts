import { Request, Response } from 'express';
import * as expenseService from './expense.service';
import { AuthRequest } from '../../middleware/auth';

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const expense = await expenseService.createExpense(
      req.body,
      userId!
    );
    res.status(201).json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExpenses = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate, categoryId } = req.query;
    const expenses = await expenseService.getAllExpenses({
      startDate: startDate as string,
      endDate: endDate as string,
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
    });
    res.status(200).json(expenses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const expense =
      await expenseService.getExpenseById(
        parseInt(id as string)
      );
    if (!expense) {
      return res
        .status(404)
        .json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const expense =
      await expenseService.updateExpense(
        parseInt(id as string),
        req.body,
        userId!
      );
    res.status(200).json(expense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await expenseService.deleteExpense(
      parseInt(id as string)
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
