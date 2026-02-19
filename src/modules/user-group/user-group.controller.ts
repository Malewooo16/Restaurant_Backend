import { Request, Response } from 'express';
import * as userGroupService from './user-group.service';

export const getAllUserGroups = async (req: Request, res: Response) => {
  try {
    const groups = await userGroupService.getAllUserGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user groups', error });
  }
};

export const getUserGroupById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const group = await userGroupService.getUserGroupById(id);
    if (!group) {
      return res.status(404).json({ message: 'User group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user group', error });
  }
};

export const createUserGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, isDefault, permissionIds } = req.body;
    const group = await userGroupService.createUserGroup({ name, description, isDefault, permissionIds });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user group', error });
  }
};

export const updateUserGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, description, isDefault, isActive, permissionIds } = req.body;
    const group = await userGroupService.updateUserGroup(id, { name, description, isDefault, isActive, permissionIds });
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user group', error });
  }
};

export const deleteUserGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await userGroupService.deleteUserGroup(id);
    res.json({ message: 'User group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user group', error });
  }
};

export const setDefaultUserGroup = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const group = await userGroupService.setDefaultUserGroup(id);
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error setting default user group', error });
  }
};