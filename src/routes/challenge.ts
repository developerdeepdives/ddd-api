import { Router } from 'express';
import * as ChallengeController from '../controllers/challenge';
import { authenticateUser } from '../auth/verifyToken';

// BASE URL === /challenge
const router = Router();

router.post('/', authenticateUser, ChallengeController.addChallenge);
router.put('/:id', authenticateUser, ChallengeController.updateChallenge);
router.get('/', ChallengeController.allChallenges);
router.get('/:id', authenticateUser, ChallengeController.showChallenge);

export default router;
