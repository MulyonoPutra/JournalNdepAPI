import { Images } from './images';

export interface Category {
	_id?: string;
	name: string;
	description: string;
	images: Images;
}
