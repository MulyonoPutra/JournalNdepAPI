import { NextFunction, Request } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import HeroSchema from '../models/hero.schema';
import FeaturesSchema from '../models/features.schema';
import AboutSchema from '../models/about.schema';
import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import AppError from '../utility/app-error';
import { About, Features, Hero } from '../interface/content';

export type ContentResponseType = TypedResponse<
	| ResponseMessage
	| ResponseEntity<Hero>
	| ResponseEntity<Features>
	| ResponseEntity<About>
>;
export type ContentRequestType = TypedRequest<
	Record<string, never>,
	Hero | Features | About
>;

const version = '-__v';

export const getHeroes = async (
	req: Request,
	res: ContentResponseType,
	next: NextFunction
) => {
	const heroes = (await HeroSchema.findOne().select(
		version
	)) as unknown as Hero;
	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: heroes,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const setHero = async (
	req: ContentRequestType,
	res: ContentResponseType,
	next: NextFunction
) => {
	let uploadAPI: UploadApiResponse;
	const files = req.files as Express.Multer.File[];
	const fileUrl: string[] = [];
	try {
		await Promise.all(
			files.map(async (file: { path: string }) => {
				uploadAPI = await cloudinary.uploader.upload(file.path, {
					folder: 'journal-ndep/Content',
					resource_type: 'auto',
				});
				fileUrl.push(uploadAPI.secure_url);
			})
		);

		const created = await HeroSchema.create({
			images: fileUrl,
			...req.body,
		});

		return res.status(201).json({
			message: 'Created!',
			data: created,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const setFeatures = async (
	req: ContentRequestType,
	res: ContentResponseType,
	next: NextFunction
) => {
	const created = await FeaturesSchema.create(req.body);
	try {
		return res.status(201).json({
			message: 'Created!',
			data: created,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const getFeatures = async (
	req: Request,
	res: ContentResponseType,
	next: NextFunction
) => {
	const features = (await FeaturesSchema.findOne().select(
		version
	)) as unknown as Features;
	try {
		return res.status(200).json({
			message: 'Success',
			data: features,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const removeAll = async (req: Request, res: ContentResponseType) => {
	await FeaturesSchema.remove({}).exec();

	return res.status(200).json({
		message: 'Removed!',
	});
};

export const setAbout = async (
	req: ContentRequestType,
	res: ContentResponseType,
	next: NextFunction
) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		try {
			uploadAPI = await cloudinary.uploader.upload(req.file.path, {
				folder: 'journal-ndep/Content',
				resource_type: 'auto',
			});

			const { originalname } = req.file;
			const { secure_url, bytes, format, public_id } = uploadAPI;

			const created = await AboutSchema.create({
				images: {
					public_id,
					filename: originalname,
					sizeInBytes: bytes,
					secure_url,
					format,
				},
				...req.body,
			});
			return res.status(201).json({
				message: 'Created!',
				data: created,
			});
		} catch (error) {
			return next(new AppError('Something went wrong!', 400));
		}
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const getAbout = async (
	req: Request,
	res: ContentResponseType,
	next: NextFunction
) => {
	const about = (await AboutSchema.findOne().select(
		version
	)) as unknown as About;
	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: about,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};
