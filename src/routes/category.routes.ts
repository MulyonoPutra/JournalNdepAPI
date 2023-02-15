import { Router } from 'express';
import {
	createCategory,
	findAllCategory,
	findById,
	findCategoriesWithPagination,
	findWithInfinitePage,
	removeCategory,
	updateCategory,
} from '../controllers/category.controller';
import { isAuthenticate } from '../middleware/is-authenticate';
import upload from '../middleware/upload-multer';

const router: Router = Router();

router.get('/', findAllCategory);
router.get('/paging', findCategoriesWithPagination);
router.get('/infinite', findWithInfinitePage);
router.get('/:id', findById);
router.put('/:id', isAuthenticate, upload.single('images'), updateCategory);
router.post('/', isAuthenticate, upload.single('images'), createCategory);
router.delete('/:id', isAuthenticate, removeCategory);

export default router;
