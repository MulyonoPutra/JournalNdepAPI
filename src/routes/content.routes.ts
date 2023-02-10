import { Router } from 'express';
import {
	findAllContent,
	getAbout,
	getFeatures,
	getHeroes,
	removeAll,
	setAbout,
	setFeatures,
	setHero,
} from '../controllers/content.controller';
import { isAuthenticate } from '../middleware/is-authenticate';
import upload from '../middleware/upload-multer';

const router: Router = Router();

router.get('/', findAllContent);
router.get('/hero', getHeroes);
router.post('/features', isAuthenticate, setFeatures);
router.get('/features', getFeatures);
router.delete('/features', isAuthenticate, removeAll);
router.post('/hero', isAuthenticate, upload.array('images', 4), setHero);
router.post('/about', isAuthenticate, upload.single('images'), setAbout);
router.get('/about', getAbout);

export default router;
