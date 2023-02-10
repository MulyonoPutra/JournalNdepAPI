import express from 'express';
import upload from '../middleware/upload-multer';
import {
	findAll,
	findFileById,
	multipleFields,
	removeFile,
	uploadFile,
} from '../controllers/file.controller';

const uploads = upload.fields([{ name: 'images' }, { name: 'cover' }]);

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);
router.post('/multiple', uploads, multipleFields);
router.get('/:id', findFileById);
router.get('/', findAll);
router.delete('/:id', removeFile);

export default router;
