import { Router } from 'express';
import * as UserController from '../controllers/user';
import { authenticateUser, ensureUserIdentity } from '../auth/verifyToken';

// BASE URL === /user
const router = Router();

router.post('/register', UserController.registerUser);
router.put('/changePassword', authenticateUser, UserController.changePassword);
router.put(
  '/:id',
  authenticateUser,
  ensureUserIdentity('params', 'id'),
  UserController.editUser
);
router.get('/:id', UserController.singleUser);
router.get('/verifyEmail/:token', UserController.verifyEmail);
router.post('/login', UserController.loginUser);

export default router;
