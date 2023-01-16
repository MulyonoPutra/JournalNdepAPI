import { login, register } from '../controllers';
import { logout, refreshToken } from '../controllers/auth.controller';

import { Router } from 'express';
import { loginUserSchema } from '../utility/input-validation';
import { validate } from '../middleware/validation';

const router = Router();

router.post('/register-admin', register('admin'));
router.post('/register', register());
router.post('/login', validate(loginUserSchema), login);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

export default router;
