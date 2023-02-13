import { model, Schema } from 'mongoose';
import { Category } from '../interface/category';

const CategorySchema = new Schema<Category>(
	{
		name: { type: String, required: true },
		description: { type: String, required: false },
		images: {
			public_id: {
				type: String,
				required: false,
			},
			filename: {
				type: String,
				required: false,
			},
			secure_url: {
				type: String,
				required: false,
			},
			format: {
				type: String,
				required: false,
			},
			sizeInBytes: {
				type: String,
				required: false,
			},
		},
	},
	{ timestamps: true }
);

export default model<Category>('Category', CategorySchema);
