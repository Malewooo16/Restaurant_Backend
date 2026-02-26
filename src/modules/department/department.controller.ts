import { Request, Response } from 'express';
import * as departmentService from './department.service';
import { AuthRequest } from '../../middleware/auth';

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json(departments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const departmentId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const department = await departmentService.getDepartmentById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const department = await departmentService.createDepartment(req.body, userId!);
    res.status(201).json(department);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const departmentId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const department = await departmentService.updateDepartment(departmentId, req.body, userId!);
    res.status(200).json(department);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const departmentId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await departmentService.deleteDepartment(departmentId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};