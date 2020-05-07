import { Router } from 'express';
import * as UserController from '../controllers/user';

// BASE URL === /user
const router = Router();

router.post('/register', UserController.registerUser);
router.get('/:id', UserController.singleUser);
router.post('/login', UserController.loginUser);

export default router;
