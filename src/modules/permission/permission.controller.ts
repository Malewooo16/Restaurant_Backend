import { Request, Response } from 'express';
import * as permissionService from './permission.service';

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions', error });
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const permission = await permissionService.getPermissionById(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permission', error });
  }
};

export const getPermissionsByCategory = async (req: Request, res: Response) => {
  try {
    const category = req.params.category as string;
    const permissions = await permissionService.getPermissionsByCategory(category);
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching permissions by category', error });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;
    const permission = await permissionService.createPermission({ name, description, category });
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating permission', error });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, description, category, isActive } = req.body;
    const permission = await permissionService.updatePermission(id, { name, description, category, isActive });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating permission', error });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await permissionService.deletePermission(id);
    res.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting permission', error });
  }
};