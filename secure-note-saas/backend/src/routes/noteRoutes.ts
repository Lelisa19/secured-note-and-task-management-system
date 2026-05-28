import express from 'express';
import * as noteController from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.patch('/:id/archive', noteController.archiveNote);
router.patch('/:id/trash', noteController.trashNote);
router.patch('/:id/restore', noteController.restoreNote);

export default router;
