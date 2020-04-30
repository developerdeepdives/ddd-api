import { Router } from 'express';
import * as UserController from '../controllers/user';

const router = Router();

router.post('/register', UserController.registerUser);

export default router;
