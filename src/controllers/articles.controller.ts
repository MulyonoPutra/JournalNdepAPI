import { NextFunction, Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import articlesSchema from '../models/articles.schema';
import categorySchema from '../models/category.schema';
import { UserRequest } from '../interface/user';
import { Articles } from '../interface/articles';
import AppError from '../utility/app-error';
import { ArticlesResponseType } from '../type/articles.type';

const userPopulated = { path: 'user', select: ['_id', 'username', 'avatar'] };
const categoryPopulated = {
	path: 'category',
	select: ['_id', 'name'],
};

export const findAllArticles = async (
	req: Request,
	res: ArticlesResponseType,
	next: NextFunction
) => {
	try {
		const articles = (await articlesSchema
			.find({})
			.populate(userPopulated)
			.populate(categoryPopulated)
			.select('-__v')
			.sort({ createdAt: -1 })
			.exec()) as unknown as Articles[];

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
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const recentArticles = async (
	req: Request,
	res: ArticlesResponseType,
	next: NextFunction
) => {
	try {
		const articles = (await articlesSchema
			.find({})
			.populate(userPopulated)
			.populate(categoryPopulated)
			.select('-__v')
			.sort({ createdAt: -1 })
			.limit(4)
			.exec()) as unknown as Articles[];

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
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const createArticles = async (
	req: UserRequest,
	res: ArticlesResponseType,
	next: NextFunction
) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
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

		const { originalname: filename } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const {
			category: { id },
		} = req.body;
		const category = await categorySchema.findById(id);
		const newArticles = {
			...req.body,
			images: {
				public_id,
				filename,
				secure_url,
				format,
				sizeInBytes: bytes,
			},
			category: { _id: category?._id },
			user: req.user?._id,
		};

		await articlesSchema.create(newArticles);

		return res.status(201).json({
			message: 'Created!',
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findById = async (
	req: Request,
	res: ArticlesResponseType,
	next: NextFunction
) => {
	const { id } = req.params;
	const article = (await articlesSchema
		.findById(id)
		.populate(userPopulated)
		.populate(categoryPopulated)
		.select('-__v')
		.exec()) as unknown as Articles;

	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: article,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const removeArticles = async (
	req: Request,
	res: ArticlesResponseType,
	next: NextFunction
) => {
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
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const updateArticles = async (
	req: UserRequest,
	res: ArticlesResponseType,
	next: NextFunction
) => {
	const { id } = req.params;
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		const article = await articlesSchema.findById(id);

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

		const {
			category: { id: categoryId },
		} = req.body;
		const category = await categorySchema.findById(categoryId);

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
			category: { _id: category?._id },
			user: req.user?._id,
		};

		await articlesSchema.findByIdAndUpdate(req.params.id, data, {
			new: true,
		});

		return res.status(200).json({ message: 'Updated!' });
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const searchArticles = async (
	req: Request,
	res: ArticlesResponseType,
	next: NextFunction
) => {
	const query = req.query.find;
	try {
		const data = (await articlesSchema
			.find({
				$or: [
					{ title: { $regex: query, $options: 'i' } },
					{ subtitle: { $regex: query, $options: 'i' } },
				],
			})
			.populate(userPopulated)
			.populate(categoryPopulated)
			.select('-__v')
			.exec()) as unknown as Articles[];

		return res.status(200).json({ message: 'Successfully!', data });
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findArticleByUserId = async (req: Request, res: ArticlesResponseType, next: NextFunction) => {
	try {
		const userId = req.params.id;
		const data = await articlesSchema.find({ user: userId })
			.populate(userPopulated)
			.populate(categoryPopulated)
			.select('-__v')
			.exec() as unknown as Articles[];
		return res.status(200).json({ message: 'Successfully!', data });

	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
}

export const findArticleByCategoryId = async (req: Request, res: ArticlesResponseType, next: NextFunction) => {
	try {
		const { id } = req.params;
		const data = await articlesSchema.find({ category: id })
			.populate(userPopulated)
			.populate(categoryPopulated)
			.select('-__v')
			.exec() as unknown as Articles;

		if(!data) {
			return res.status(404).json({ message: `Article with category ${id} is not found` });
		}

		return res.status(200).json({ message: 'Successfully!', data });
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
}

export const removeArticleByCategoryId = async (req: Request, res: ArticlesResponseType, next: NextFunction) => {
	try {
		const categoryId = req.params.categoryId;
		const articleId = req.params.articleId;

		const category = await categorySchema.findById(categoryId);
		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		// Find the article in the category
		const article = await articlesSchema.findOne({ _id: articleId, category: categoryId });
		if (!article) {
			return res.status(404).json({ message: 'Article not found in category' });
		}

		// Remove the article
		const result = await articlesSchema.deleteOne({ _id: articleId, category: categoryId });
		res.status(200).json({ message: `Removed ${result.deletedCount} article` });

	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}

}