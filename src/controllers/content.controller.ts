import { Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import ContentSchema from '../models/content.schema';
import HeroSchema from '../models/hero.schema';
import FeaturesSchema from '../models/features.schema';
import AboutSchema from '../models/about.schema';

const version = '-__v';
export const findAllContent = async (req: Request, res: Response) => {
	const content = await ContentSchema.find();
	try {
		if (content.length <= 0) {
			return res.status(200).json({
				message: 'No results – There is nothing to show',
			});
		}

		return res.status(200).json({
			message: 'Success',
			data: content,
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const getHeroes = async (req: Request, res: Response) => {
	const heroes = await HeroSchema.findOne().select(version);
	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: heroes,
		});
	} catch (e) {
		return errorResponse(e, res);
	}
};

export const setHero = async (req: Request, res: Response) => {
	let uploadAPI: UploadApiResponse;
	const files = req.files as Express.Multer.File[];
	const fileUrl: any[] = [];
	try {
		await Promise.all(
			files.map(async (file: any) => {
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
		return res.status(500).json({ messages: 'Internal Server Error!' });
	}
};

export const setFeatures = async (req: Request, res: Response) => {
	const created = await FeaturesSchema.create(req.body);
	try {
		return res.status(201).json({
			message: 'Created!',
			data: created,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error!' });
	}
};

export const getFeatures = async (req: Request, res: Response) => {
	const features = await FeaturesSchema.findOne().select(version);
	try {
		return res.status(200).json({
			message: 'Success',
			data: features,
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const removeAll = async (req: Request, res: Response) => {
	await FeaturesSchema.remove({}).exec();

	return res.status(200).json({
		message: 'Removed!',
	});
};

export const setAbout = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ messages: 'No file uploaded!' });
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
			return res.status(400).json({ message: 'Something went wrong!' });
		}
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const getAbout = async (req: Request, res: Response) => {
	const about = await AboutSchema.findOne().select(version);
	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: about,
		});
	} catch (e) {
		return errorResponse(e, res);
	}
};

const errorResponse = (e: unknown, res: Response) => {
	const errors = (e as Error).message;
	return res.status(500).json({ message: errors });
};
