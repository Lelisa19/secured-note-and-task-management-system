import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { formatErrorMessage, logRequestError } from '../lib/utils.js';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    logRequestError('POST /api/auth/register', error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error: any) {
      logRequestError('POST /api/auth/login', error, req.body);
      res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.user!.id);
    res.json(user);
  } catch (error: any) {
    logRequestError('GET /api/auth/me', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};
