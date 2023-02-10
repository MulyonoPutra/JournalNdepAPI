import { Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import articlesSchema from '../models/articles.schema';
export const findAllArticles = async (req: Request, res: Response) => {
	const articles = await articlesSchema.find();
	try {
		if (articles.length <= 0) {
			return res.status(200).json({
				message: 'No results – There is nothing to show',
			});
		}

		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: articles,
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const createArticles = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ messages: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		try {
			uploadAPI = await cloudinary.uploader.upload(req.file.path, {
				folder: 'journal-ndep/Articles',
				resource_type: 'auto',
			});
		} catch (error) {
			return res.status(400).json({ message: 'Something went wrong!' });
		}

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const created = await articlesSchema.create({
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
		return res.status(500).json({ msg: 'Internal Server Error!' });
	}
};

export const findById = async (req: Request, res: Response) => {
	const { id } = req.params;
	const article = await articlesSchema.findById(id);

	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: article,
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const removeArticles = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const article = await articlesSchema.findById(id);
		const publicId = article?.images.public_id;

		if (publicId) {
			await cloudinary.uploader.destroy(publicId);
		}

		await articlesSchema.findByIdAndRemove(id);
		return res.status(200).json({
			message: 'Successfully removed!',
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const updateArticles = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		if (!req.file) {
			return res.status(400).json({ messages: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		let article = await articlesSchema.findById(id);

		const publicId = article?.images.public_id;

		try {
			if (publicId) {
				await cloudinary.uploader.destroy(publicId);
			}

			uploadAPI = await cloudinary.uploader.upload(req?.file?.path, {
				folder: 'journal-ndep/Article',
				resource_type: 'auto',
			});
		} catch (error) {
			return res.status(400).json({ message: 'Bad Request!' });
		}

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const data = {
			title: req.body.title || article?.title,
			subtitle: req.body.subtitle || article?.subtitle,
			article: req.body.article || article?.article,
			images:
				{
					public_id,
					filename: originalname,
					sizeInBytes: bytes,
					secure_url,
					format,
				} || article?.images,
		};

		article = await articlesSchema.findByIdAndUpdate(req.params.id, data, {
			new: true,
		});

		return res.status(200).json({ message: 'Updated!', data: article });
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};
