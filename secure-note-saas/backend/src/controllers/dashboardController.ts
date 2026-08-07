import { Response } from 'express';
import * as dashboardService from '../services/dashboardService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { formatErrorMessage, logRequestError, getSingleQueryParam } from '../lib/utils.js';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user!.id);
    res.json(stats);
  } catch (error: any) {
    logRequestError('GET /api/dashboard/stats', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getReminders = async (req: AuthRequest, res: Response) => {
  try {
    const reminders = await dashboardService.getReminders(req.user!.id);
    res.json(reminders);
  } catch (error: any) {
    logRequestError('GET /api/dashboard/reminders', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const createReminder = async (req: AuthRequest, res: Response) => {
  try {
    const reminder = await dashboardService.createReminder(req.body, req.user!.id);
    res.status(201).json(reminder);
  } catch (error: any) {
    logRequestError('POST /api/dashboard/reminders', error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response) => {
  try {
    const reminderId = getSingleQueryParam(req.params.id)!;
    await dashboardService.deleteReminder(reminderId, req.user!.id);
    res.json({ message: 'Reminder deleted' });
  } catch (error: any) {
    logRequestError(`DELETE /api/dashboard/reminders/${req.params.id}`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await dashboardService.getFavorites(req.user!.id);
    res.json(favorites);
  } catch (error: any) {
    logRequestError('GET /api/dashboard/favorites', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await dashboardService.getNotifications(req.user!.id);
    res.json(notifications);
  } catch (error: any) {
    logRequestError('GET /api/dashboard/notifications', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const notificationId = getSingleQueryParam(req.params.id)!;
    await dashboardService.markNotificationRead(notificationId, req.user!.id);
    res.json({ message: 'Marked read' });
  } catch (error: any) {
    logRequestError(`PUT /api/dashboard/notifications/${req.params.id}/read`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getSecurityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await dashboardService.getSecurityLogs(req.user!.id);
    res.json(logs);
  } catch (error: any) {
    logRequestError('GET /api/dashboard/security-logs', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await dashboardService.updateProfile(req.user!.id, req.body);
    res.json(profile);
  } catch (error: any) {
    logRequestError('PUT /api/dashboard/profile', error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};
