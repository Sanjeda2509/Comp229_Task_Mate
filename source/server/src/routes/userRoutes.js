import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController.js';
const router = Router();
router.use(requireAuth);
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.delete('/me', deleteProfile);
export default router;
