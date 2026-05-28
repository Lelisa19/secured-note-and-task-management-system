import express from 'express';
import * as workspaceController from '../controllers/workspaceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', workspaceController.getWorkspaces);
router.get('/:id', workspaceController.getWorkspaceById);
router.post('/', workspaceController.createWorkspace);
router.post('/:workspaceId/projects', workspaceController.createProject);

export default router;
