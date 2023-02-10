import { Images } from './images';
import { Category } from './category';

export interface Articles {
	title: string;
	subtitle: string;
	images: Images;
	article: string;
	category: Category;
}
