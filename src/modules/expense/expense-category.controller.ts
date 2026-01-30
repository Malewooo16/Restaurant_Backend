import { Request, Response } from 'express';
import * as expenseCategoryService from './expense-category.service';

export const createExpenseCategory = async (req: Request, res: Response) => {
  try {
    const expenseCategory = await expenseCategoryService.createExpenseCategory(
      req.body
    );
    res.status(201).json(expenseCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllExpenseCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const expenseCategories =
      await expenseCategoryService.getAllExpenseCategories();
    res.status(200).json(expenseCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseCategoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const expenseCategory =
      await expenseCategoryService.getExpenseCategoryById(
        parseInt(id as string)
      );
    if (!expenseCategory) {
      return res
        .status(404)
        .json({ message: 'Expense category not found' });
    }
    res.status(200).json(expenseCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpenseCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const expenseCategory =
      await expenseCategoryService.updateExpenseCategory(
        parseInt(id as string),
        req.body
      );
    res.status(200).json(expenseCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpenseCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await expenseCategoryService.deleteExpenseCategory(
      parseInt(id as string)
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
