import { Images } from './images';

export interface Content {
	hero: Hero;
	features: Features;
	about: About;
}

export interface Hero {
	title: string;
	description: string;
	images: Images;
}

export interface Features {
	title: string;
	list: List[];
}

export interface List {
	category: string;
	description: string;
}

export interface About {
	title: string;
	description: string;
	images: Images;
}
