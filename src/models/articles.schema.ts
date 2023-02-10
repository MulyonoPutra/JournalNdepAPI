import { model, Schema } from 'mongoose';
import { Articles } from '../interface/articles';

const ArticlesSchema = new Schema<Articles>({
	title: { type: String, required: true },
	subtitle: { type: String, required: true },
	article: { type: String, required: true },
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
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
	},
});

export default model<Articles>('Articles', ArticlesSchema);
