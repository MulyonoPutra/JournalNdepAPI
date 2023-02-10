import { model, Schema } from 'mongoose';
import { Category } from '../interface/category';

const CategorySchema = new Schema<Category>({
	name: { type: String, required: true },
	description: { type: String, required: false },
	images: {
		public_id: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		secure_url: {
			type: String,
			required: true,
		},
		format: {
			type: String,
			required: true,
		},
		sizeInBytes: {
			type: String,
			required: true,
		},
	},
});

export default model<Category>('Category', CategorySchema);
