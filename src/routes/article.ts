import { Router } from 'express';
import * as ArticleController from '../controllers/article';

// BASE PATH = /article
const router = Router();

router.get('/', ArticleController.allArticles);
router.get('/:id', ArticleController.showArticle);
router.post('/', ArticleController.addArticle);

export default router;
