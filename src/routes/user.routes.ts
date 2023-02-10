import { Router } from 'express';

import { findAll, findById, update } from '../controllers/user.controller';
import { isAuthenticate } from '../middleware/is-authenticate';
import { RestrictTo } from '../middleware/restrict-to';
import upload from '../middleware/upload-multer';

const router = Router();

router.get('/', isAuthenticate, RestrictTo('admin'), findAll);
router.get('/:id', isAuthenticate, findById);
router.put('/:id', isAuthenticate, upload.single('images'), update);

export default router;
