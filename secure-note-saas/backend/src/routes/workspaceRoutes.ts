import express from 'express';
import * as workspaceController from '../controllers/workspaceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Invitations & My Workspaces
router.get('/', workspaceController.getWorkspaces);
router.get('/invitations', workspaceController.getInvitations);
router.post('/invitations/:membershipId/accept', workspaceController.acceptInvitation);
router.post('/invitations/:membershipId/reject', workspaceController.rejectInvitation);

// Workspace CRUD & Details
router.post('/', workspaceController.createWorkspace);
router.get('/:id', workspaceController.getWorkspaceById);
router.put('/:id', workspaceController.updateWorkspace);

// Workspace Sub-resources
router.post('/:workspaceId/members', workspaceController.inviteMember);
router.delete('/:workspaceId/members/:memberId', workspaceController.removeMember);
router.get('/:workspaceId/notes', workspaceController.getWorkspaceNotes);
router.get('/:workspaceId/tasks', workspaceController.getWorkspaceTasks);
router.get('/:workspaceId/projects', workspaceController.getWorkspaceProjects);
router.post('/:workspaceId/projects', workspaceController.createProject);
router.get('/:workspaceId/activity', workspaceController.getWorkspaceActivity);
router.get('/:workspaceId/roles', workspaceController.getWorkspaceRoles);
router.post('/:workspaceId/roles', workspaceController.createWorkspaceRole);
router.get('/:workspaceId/files', workspaceController.getWorkspaceFiles);
router.post('/:workspaceId/files', workspaceController.createWorkspaceFile);
router.delete('/:workspaceId/files/:fileId', workspaceController.deleteWorkspaceFile);

export default router;
