import { Request, Response } from 'express';
import * as staffRoleService from './staff-role.service';

export const getAllStaffRoles = async (req: Request, res: Response) => {
  try {
    const staffRoles = await staffRoleService.getAllStaffRoles();
    res.status(200).json(staffRoles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const staffRole = await staffRoleService.getStaffRoleById(roleId);
    if (!staffRole) {
      return res.status(404).json({ message: 'Staff role not found' });
    }
    res.status(200).json(staffRole);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffRolesByDepartment = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req.params;
    const deptId = Array.isArray(departmentId) ? parseInt(departmentId[0]) : parseInt(departmentId);
    const staffRoles = await staffRoleService.getStaffRolesByDepartment(deptId);
    res.status(200).json(staffRoles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createStaffRole = async (req: Request, res: Response) => {
  try {
    const staffRole = await staffRoleService.createStaffRole(req.body);
    res.status(201).json(staffRole);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStaffRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const staffRole = await staffRoleService.updateStaffRole(roleId, req.body);
    res.status(200).json(staffRole);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStaffRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await staffRoleService.deleteStaffRole(roleId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};