import { Router } from 'express';
import * as LanguageController from '../controllers/language';

const router = Router();

router.get('/', LanguageController.getLanguages);

export default router;
