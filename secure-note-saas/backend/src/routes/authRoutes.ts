import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/organizations', authController.searchOrganizations);
router.post('/register', authController.register);
router.post('/login', authController.login);
<<<<<<< HEAD
router.post('/google', authController.googleAuth);
=======
router.post('/google', authController.googleLogin);
>>>>>>> 2aed3a1 (Initial commit)
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
