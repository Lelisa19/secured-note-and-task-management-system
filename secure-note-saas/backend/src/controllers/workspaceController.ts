import { Response } from 'express';
import * as workspaceService from '../services/workspaceService.js';
import type { AuthRequest } from '../middleware/auth.js';
import { formatErrorMessage, logRequestError, getSingleQueryParam } from '../lib/utils.js';

export const getWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const workspaces = await workspaceService.getWorkspaces(req.user!.id);
    res.json(workspaces);
  } catch (error: any) {
    logRequestError('GET /api/workspaces', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getInvitations = async (req: AuthRequest, res: Response) => {
  try {
    const invitations = await workspaceService.getInvitations(req.user!.id);
    res.json(invitations);
  } catch (error: any) {
    logRequestError('GET /api/workspaces/invitations', error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const acceptInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const membershipId = getSingleQueryParam(req.params.membershipId)!;
    const result = await workspaceService.acceptInvitation(membershipId, req.user!.id);
    res.json(result);
  } catch (error: any) {
    logRequestError(`POST /api/workspaces/invitations/${req.params.membershipId}/accept`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const rejectInvitation = async (req: AuthRequest, res: Response) => {
  try {
    const membershipId = getSingleQueryParam(req.params.membershipId)!;
    const result = await workspaceService.rejectInvitation(membershipId, req.user!.id);
    res.json(result);
  } catch (error: any) {
    logRequestError(`POST /api/workspaces/invitations/${req.params.membershipId}/reject`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceById = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.id)!;
    const workspace = await workspaceService.getWorkspaceById(workspaceId, req.user!.id);
    res.json(workspace);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.id}`, error);
    res.status(404).json({ message: formatErrorMessage(error) });
  }
};

export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.body, req.user!.id);
    res.status(201).json(workspace);
  } catch (error: any) {
    logRequestError('POST /api/workspaces', error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const { email } = req.body;
    const member = await workspaceService.inviteMember(workspaceId, email, req.user!.id);
    res.status(201).json(member);
  } catch (error: any) {
    logRequestError(`POST /api/workspaces/${req.params.workspaceId}/members`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const memberId = getSingleQueryParam(req.params.memberId)!;
    const result = await workspaceService.removeMember(workspaceId, memberId, req.user!.id);
    res.json(result);
  } catch (error: any) {
    logRequestError(`DELETE /api/workspaces/${req.params.workspaceId}/members/${req.params.memberId}`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const project = await workspaceService.createProject(workspaceId, req.body, req.user!.id);
    res.status(201).json(project);
  } catch (error: any) {
    logRequestError(`POST /api/workspaces/${req.params.workspaceId}/projects`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceNotes = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const notes = await workspaceService.getWorkspaceNotes(workspaceId, req.user!.id);
    res.json(notes);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.workspaceId}/notes`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceTasks = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const tasks = await workspaceService.getWorkspaceTasks(workspaceId, req.user!.id);
    res.json(tasks);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.workspaceId}/tasks`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceProjects = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const projects = await workspaceService.getWorkspaceProjects(workspaceId, req.user!.id);
    res.json(projects);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.workspaceId}/projects`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceActivity = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const activities = await workspaceService.getWorkspaceActivity(workspaceId, req.user!.id);
    res.json(activities);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.workspaceId}/activity`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const updateWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.id)!;
    const workspace = await workspaceService.updateWorkspace(workspaceId, req.body, req.user!.id);
    res.json(workspace);
  } catch (error: any) {
    logRequestError(`PUT /api/workspaces/${req.params.id}`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceRoles = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const roles = await workspaceService.getWorkspaceRoles(workspaceId, req.user!.id);
    res.json(roles);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.workspaceId}/roles`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const createWorkspaceRole = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const role = await workspaceService.createWorkspaceRole(workspaceId, req.body, req.user!.id);
    res.status(201).json(role);
  } catch (error: any) {
    logRequestError(`POST /api/workspaces/${req.params.workspaceId}/roles`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const getWorkspaceFiles = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const files = await workspaceService.getWorkspaceFiles(workspaceId, req.user!.id);
    res.json(files);
  } catch (error: any) {
    logRequestError(`GET /api/workspaces/${req.params.workspaceId}/files`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const createWorkspaceFile = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const file = await workspaceService.createWorkspaceFile(workspaceId, req.body, req.user!.id);
    res.status(201).json(file);
  } catch (error: any) {
    logRequestError(`POST /api/workspaces/${req.params.workspaceId}/files`, error, req.body);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};

export const deleteWorkspaceFile = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = getSingleQueryParam(req.params.workspaceId)!;
    const fileId = getSingleQueryParam(req.params.fileId)!;
    const result = await workspaceService.deleteWorkspaceFile(
      workspaceId,
      fileId,
      req.user!.id
    );
    res.json(result);
  } catch (error: any) {
    logRequestError(`DELETE /api/workspaces/${req.params.workspaceId}/files/${req.params.fileId}`, error);
    res.status(400).json({ message: formatErrorMessage(error) });
  }
};
