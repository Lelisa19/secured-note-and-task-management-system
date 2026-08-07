import { Response } from 'express';
import * as taskService from '../services/taskService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { getSingleQueryParam, formatErrorMessage, logRequestError } from '../lib/utils.js';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, workspaceId, projectId } = req.query;
    const tasks = await taskService.getTasks(
      req.user!.id,
      getSingleQueryParam(status),
      getSingleQueryParam(workspaceId),
      getSingleQueryParam(projectId)
    );
    res.json(tasks);
  } catch (error: any) {
    logRequestError('GET /api/tasks', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = getSingleQueryParam(req.params.id)!;
    const task = await taskService.getTaskById(taskId, req.user!.id);
    res.json(task);
  } catch (error: any) {
    logRequestError(`GET /api/tasks/${req.params.id}`, error);
    res.status(404).json({ message: formatErrorMessage(error) });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.createTask(req.body, req.user!.id);
    res.status(201).json(task);
  } catch (error: any) {
    logRequestError('POST /api/tasks', error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = getSingleQueryParam(req.params.id)!;
    const task = await taskService.updateTask(taskId, req.body, req.user!.id);
    res.json(task);
  } catch (error: any) {
    logRequestError(`PUT /api/tasks/${req.params.id}`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = getSingleQueryParam(req.params.id)!;
    await taskService.deleteTask(taskId, req.user!.id);
    res.status(204).send();
  } catch (error: any) {
    logRequestError(`DELETE /api/tasks/${req.params.id}`, error);
    res.status(404).json({ message: formatErrorMessage(error) });
  }
};
