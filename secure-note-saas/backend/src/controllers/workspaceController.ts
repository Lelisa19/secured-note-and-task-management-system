import { Response } from 'express';
import * as workspaceService from '../services/workspaceService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { getSingleQueryParam } from '../lib/utils.js';

export const getWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const workspaces = await workspaceService.getWorkspaces(req.user!.id);
    res.json(workspaces);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getWorkspaceById = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.id)!;
    const workspace = await workspaceService.getWorkspaceById(workspaceId, req.user!.id);
    res.json(workspace);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.body, req.user!.id);
    res.status(201).json(workspace);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const project = await workspaceService.createProject(
      workspaceId,
      req.body,
      req.user!.id
    );
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
