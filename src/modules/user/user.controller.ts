import { Request, Response } from 'express';
import * as userService from './user.service';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, staffId, userGroupId } = req.body;
    const user = await userService.createUser({ username, email, password, staffId, userGroupId });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { username, email, password, staffId, userGroupId, isActive, permissionOverrides } = req.body;
    const user = await userService.updateUser(id, { 
      username, 
      email, 
      password, 
      staffId, 
      userGroupId, 
      isActive,
      permissionOverrides 
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await userService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { newPassword } = req.body;
    await userService.changeUserPassword(id, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error });
  }
};

export const getEffectivePermissions = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const permissions = await userService.getEffectivePermissions(id);
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching effective permissions', error });
  }
};

export const updateUserPermission = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    const permissionId = parseInt(req.params.permissionId as string);
    const { allowed } = req.body;
    
    await userService.updateUserPermission(userId, permissionId, allowed);
    res.json({ message: 'Permission updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user permission', error });
  }
};