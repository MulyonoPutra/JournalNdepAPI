import mongoose, { model, Schema } from 'mongoose';
import { Content } from '../interface/content';

const ContentSchema = new Schema<Content>({
	hero: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Hero',
		required: true,
	},
	features: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Features',
		required: true,
	},
	about: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'About',
		required: true,
	},
});

export default model<Content>('Content', ContentSchema);
