import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/reminders', dashboardController.getReminders);
router.post('/reminders', dashboardController.createReminder);
router.delete('/reminders/:id', dashboardController.deleteReminder);

router.get('/favorites', dashboardController.getFavorites);
router.get('/notifications', dashboardController.getNotifications);
router.patch('/notifications/:id/read', dashboardController.markNotificationRead);
router.get('/security-logs', dashboardController.getSecurityLogs);
router.put('/profile', dashboardController.updateProfile);

export default router;
