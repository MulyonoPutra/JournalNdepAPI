import { Images } from './images';
import { Category } from './category';
import { IUser } from './user';
import { Document } from 'mongoose';

export interface Articles extends Document {
	title: string;
	subtitle: string;
	article: string;
	images: Images;
	category: Category;
	user: IUser;
	_doc: object;
}
