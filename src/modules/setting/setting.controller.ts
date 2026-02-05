import { Request, Response } from 'express';
import * as settingService from './setting.service';

export const getSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const keyValue = Array.isArray(key) ? key[0] : key;
    const setting = await settingService.getSettingByKey(keyValue);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }
    res.status(200).json(setting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSettings = async (req: Request, res: Response) => {
  try {
    const settings = await settingService.getAllSettings();
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const keyValue = Array.isArray(key) ? key[0] : key;
    const { value, description } = req.body;
    const setting = await settingService.upsertSetting(keyValue, value, description);
    res.status(200).json(setting);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const settings = await settingService.upsertSettings(data);
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const keyValue = Array.isArray(key) ? key[0] : key;
    await settingService.deleteSetting(keyValue);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};