import { Router } from 'express';

import {
	create,
	createProduct,
	findAll,
	findById,
	remove,
	update,
} from '../controllers/product.controller';
import { isAuthenticate } from '../middleware/is-authenticate';
import { RestrictTo } from '../middleware/restrict-to';
import upload from '../middleware/upload-multer';

const router = Router();

router.get('/', isAuthenticate, RestrictTo('user'), findAll);
router.post(
	'/',
	isAuthenticate,
	RestrictTo('user'),
	upload.single('images'),
	createProduct
);
router.get('/:id', isAuthenticate, RestrictTo('user'), findById);
router.delete('/:id', isAuthenticate, RestrictTo('user'), remove);
router.put('/:id', isAuthenticate, RestrictTo('user'), update);

export default router;
