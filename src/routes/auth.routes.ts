
import { login, logout, refreshToken, register } from "../controllers/auth.controller";

import { Router } from 'express';
import {
	loginUserSchema,
	registerUserSchema,
} from '../utility/input-validation';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/register-admin', register('admin'));
router.post('/register', validate(registerUserSchema), register());
router.post('/login', validate(loginUserSchema), login);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

export default router;
