import { Router } from 'express';
import { isAuthenticate } from '../middleware/is-authenticate';
import {
	getDistricts,
	getProvinces,
	getRegencies,
	getVillages,
} from '../controllers/address.controller';

const router = Router();

router.get('/province', isAuthenticate, getProvinces);
router.get('/districts/:id', isAuthenticate, getDistricts);
router.get('/regencies/:id', isAuthenticate, getRegencies);
router.get('/villages/:id', isAuthenticate, getVillages);

export default router;
