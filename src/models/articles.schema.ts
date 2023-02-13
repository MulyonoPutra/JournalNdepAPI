import { model, Schema } from 'mongoose';
import { Articles } from '../interface/articles';

const ArticlesSchema = new Schema<Articles>(
	{
		title: { type: String, required: false },
		subtitle: { type: String, required: false },
		article: { type: String, required: false },
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
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

export default model<Articles>('Articles', ArticlesSchema);
