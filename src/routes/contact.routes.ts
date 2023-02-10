import { Router } from 'express';
import { isAuthenticate } from '../middleware/is-authenticate';
import {
	createMessages,
	findAllMessages,
} from '../controllers/contact.controller';

const router: Router = Router();

router.get('/', isAuthenticate, findAllMessages);
router.post('/', createMessages);

export default router;
