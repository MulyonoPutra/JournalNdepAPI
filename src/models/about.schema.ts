import { model, Schema } from 'mongoose';
import { About } from '../interface/content';

const AboutSchema = new Schema<About>({
	title: { type: String, required: true },
	description: { type: String, required: true },
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

export default model<About>('About', AboutSchema);
