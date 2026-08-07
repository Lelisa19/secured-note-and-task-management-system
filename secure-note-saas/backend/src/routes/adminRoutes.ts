import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Ensure authenticated user is ADMIN
const requireAdmin = (req: any, res: express.Response, next: express.NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: Super Admin privileges required' });
  }
  next();
};

router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getAdminStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/workspaces', adminController.getAllWorkspaces);
router.get('/subscriptions', adminController.getSubscriptions);
router.get('/announcements', adminController.getAnnouncements);
router.post('/announcements', adminController.createAnnouncement);
router.get('/tickets', adminController.getSupportTickets);
router.get('/security-logs', adminController.getSecurityLogs);
router.get('/payments', adminController.getPayments);

export default router;
