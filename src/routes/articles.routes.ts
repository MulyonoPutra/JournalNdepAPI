import { Router } from 'express';
import {
	createArticles,
	findAllArticles, findArticleByCategoryId, findArticleByUserId,
	findById,
	recentArticles, removeArticleByCategoryId,
	removeArticles,
	searchArticles,
	updateArticles
} from "../controllers/articles.controller";
import { isAuthenticate } from '../middleware/is-authenticate';
import upload from '../middleware/upload-multer';

const router = Router();

router.get('/recent', recentArticles);
router.get('/search', searchArticles);
router.get('/', findAllArticles);
router.get('/:id', findById);
router.get('/user/:id', isAuthenticate, findArticleByUserId);
router.get('/category/:id', findArticleByCategoryId);
router.delete('/categories/:categoryId/articles/:articleId', isAuthenticate, removeArticleByCategoryId);
router.put('/:id', isAuthenticate, upload.single('images'), updateArticles);
router.post('/', isAuthenticate, upload.single('images'), createArticles);
router.delete('/:id', isAuthenticate, removeArticles);
export default router;
