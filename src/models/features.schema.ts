import { model, Schema } from 'mongoose';
import { Features } from '../interface/content';

const FeaturesSchema = new Schema<Features>({
	title: { type: String, required: true },
	list: [
		{
			category: { type: String, required: false },
			description: { type: String, required: false },
		},
	],
});

export default model<Features>('Features', FeaturesSchema);
