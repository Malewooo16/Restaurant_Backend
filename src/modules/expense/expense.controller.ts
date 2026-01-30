import { Request, Response } from 'express';
import * as expenseService from './expense.service';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = await expenseService.createExpense(
      req.body
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
    const expenses =
      await expenseService.getAllExpenses();
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
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const expense =
      await expenseService.updateExpense(
        parseInt(id as string),
        req.body
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
