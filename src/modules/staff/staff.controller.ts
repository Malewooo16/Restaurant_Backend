import { Request, Response } from 'express';
import * as staffService from './staff.service';
import { AuthRequest } from '../../middleware/auth';

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await staffService.getAllStaff();
    res.status(200).json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWaiters = async (req: Request, res: Response) => {
  try {
    const waiters = await staffService.getWaiters();
    res.status(200).json(waiters);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staffId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const staff = await staffService.getStaffById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.status(200).json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const staff = await staffService.createStaff(req.body, userId!);
    res.status(201).json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const staffId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    const staff = await staffService.updateStaff(staffId, req.body, userId!);
    res.status(200).json(staff);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staffId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    await staffService.deleteStaff(staffId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadStaffImage = async (req: Request, res: Response) => {
  try {
    // Multer middleware attaches file to req.file
    const file = req.file as any;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the S3 URL of the uploaded file
    const imageUrl = file.location;
    res.status(200).json({ imageUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};