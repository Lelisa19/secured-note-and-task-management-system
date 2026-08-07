import { Response } from 'express';
import * as adminService from '../services/adminService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { formatErrorMessage, logRequestError, getSingleQueryParam } from '../lib/utils.js';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getAdminStats();
    res.json(stats);
  } catch (error: any) {
    logRequestError('GET /api/admin/stats', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await adminService.getUsers();
    res.json(users);
  } catch (error: any) {
    logRequestError('GET /api/admin/users', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getSingleQueryParam(req.params.id)!;
    const { role } = req.body;
    const user = await adminService.updateUserRole(userId, role);
    res.json(user);
  } catch (error: any) {
    logRequestError(`PUT /api/admin/users/${req.params.id}/role`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getAllWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const workspaces = await adminService.getAllWorkspaces();
    res.json(workspaces);
  } catch (error: any) {
    logRequestError('GET /api/admin/workspaces', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const subscriptions = await adminService.getSubscriptions();
    res.json(subscriptions);
  } catch (error: any) {
    logRequestError('GET /api/admin/subscriptions', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const announcements = await adminService.getAnnouncements();
    res.json(announcements);
  } catch (error: any) {
    logRequestError('GET /api/admin/announcements', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const announcement = await adminService.createAnnouncement(req.body);
    res.status(201).json(announcement);
  } catch (error: any) {
    logRequestError('POST /api/admin/announcements', error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getSupportTickets = async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await adminService.getSupportTickets();
    res.json(tickets);
  } catch (error: any) {
    logRequestError('GET /api/admin/support-tickets', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getSecurityLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await adminService.getSecurityLogs();
    res.json(logs);
  } catch (error: any) {
    logRequestError('GET /api/admin/security-logs', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getPayments = async (req: AuthRequest, res: Response) => {
  try {
    const payments = await adminService.getPayments();
    res.json(payments);
  } catch (error: any) {
    logRequestError('GET /api/admin/payments', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};
