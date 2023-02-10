import { model, Schema } from 'mongoose';
import { Hero } from '../interface/content';

const HeroSchema = new Schema<Hero>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	images: {
		type: [],
	},
});

export default model<Hero>('Hero', HeroSchema);
