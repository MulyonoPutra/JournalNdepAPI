import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import CategorySchema from '../models/category.schema';
import { Category } from '../interface/category';
import AppError from '../utility/app-error';
import { CategoryResponseType } from '../type/category.type';

export const findAllCategory = async (req: Request, res: CategoryResponseType, next: NextFunction) => {
	const category = (await CategorySchema.find().sort({ createdAt: -1 }).exec()) as unknown as Category[];
	try {
		if (category.length <= 0) {
			return res.status(200).json({
				message: 'No results/No data – There is nothing to show',
			});
		}

		return res.status(200).json({
			message: 'Success',
			data: category,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findCategoriesWithPagination = async (req: Request, res: CategoryResponseType, next: NextFunction) => {

	try {
		const { page = 1, pageSize = 10 } = req.query;

		const total = await CategorySchema.countDocuments();
		const data = await CategorySchema.find().skip(( +page - 1) * +pageSize).limit(+pageSize);

		return res.status(200).json({
			message: 'Success',
			data: {
				total,
				page: +page,
				pageSize: +pageSize,
				data,
			},
		});

	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
}

export const findWithInfinitePage = async (req: Request, res: CategoryResponseType, next: NextFunction) => {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const limit = 3;

		const data = await CategorySchema.find()
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();

		return res.status(200).json({
			message: 'Success',
			data
		});

	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
}

export const createCategory = async (req: Request, res: CategoryResponseType, next: NextFunction) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		try {
			uploadAPI = await cloudinary.uploader.upload(req.file.path, {
				folder: 'journal-ndep/Category',
				resource_type: 'auto',
			});
		} catch (error) {
			return res.status(400).json({ message: 'Something went wrong!' });
		}

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const created = await CategorySchema.create({
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
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findById = async (req: Request, res: CategoryResponseType, next: NextFunction) => {
	const { id } = req.params;
	const category = (await CategorySchema.findById(id)) as unknown as Category;

	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: category,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const removeCategory = async (req: Request, res: CategoryResponseType, next: NextFunction) => {
	const { id } = req.params;

	const category = await CategorySchema.findById(id);
	const publicId = category?.images.public_id;

	if (publicId) {
		await cloudinary.uploader.destroy(publicId);
	}

	await CategorySchema.findByIdAndRemove(id);

	try {
		return res.status(200).json({
			message: 'Removed!',
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const updateCategory = async (req: Request, res: CategoryResponseType, next: NextFunction) => {
	const { id } = req.params;

	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		let category = (await CategorySchema.findById(id)) as Category;

		const publicId = category?.images.public_id;

		try {
			if (publicId) {
				await cloudinary.uploader.destroy(publicId);
			}

			uploadAPI = await cloudinary.uploader.upload(req?.file?.path, {
				folder: 'journal-ndep/Category',
				resource_type: 'auto',
			});
		} catch (error) {
			return res.status(400).json({ message: 'Something went wrong!' });
		}

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const data = {
			name: req.body.name || category?.name,
			description: req.body.description || category?.description,
			images:
				{
					public_id,
					filename: originalname,
					sizeInBytes: bytes,
					secure_url,
					format,
				} || category?.images,
		};

		category = (await CategorySchema.findByIdAndUpdate(
			req.params.id,
			data,
			{
				new: true,
			}
		)) as Category;

		return res.status(200).json({ message: 'Success', data: category });
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};
