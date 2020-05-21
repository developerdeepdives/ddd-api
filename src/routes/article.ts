import { Router } from 'express';
import * as ArticleController from '../controllers/article';
import { authenticateUser } from '../auth/verifyToken';

// BASE PATH = /article
const router = Router();

router.get('/', ArticleController.allArticles);
router.get('/:id', ArticleController.showArticle);
router.post('/', authenticateUser, ArticleController.addArticle);
router.put('/:id', authenticateUser, ArticleController.updateArticle);

export default router;
