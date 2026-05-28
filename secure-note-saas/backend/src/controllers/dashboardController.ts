import { Response } from 'express';
import * as dashboardService from '../services/dashboardService.js';
import type { AuthRequest } from '../middleware/auth.js';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
