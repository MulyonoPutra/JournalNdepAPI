import { Router } from 'express';
import {
	createArticles,
	findAllArticles,
	findById,
	removeArticles,
	updateArticles,
} from '../controllers/articles.controller';
import { isAuthenticate } from '../middleware/is-authenticate';
import upload from '../middleware/upload-multer';

const router = Router();

router.get('/', findAllArticles);
router.get('/:id', findById);
router.put('/:id', isAuthenticate, upload.single('images'), updateArticles);
router.post('/', isAuthenticate, upload.single('images'), createArticles);
router.delete('/:id', isAuthenticate, removeArticles);
export default router;
