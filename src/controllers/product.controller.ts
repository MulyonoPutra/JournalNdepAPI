import { NextFunction, Request } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import ProductSchema from '../models/product.schema';
import {
	FindOneProductResponseType,
	NewProductResponseType,
	ProductRequestType,
	ProductResponseType,
	RemoveProductResponseType,
} from '../type/product.type';
import AppError from '../utility/app-error';
import { uploadCloudinary } from '../utility/upload-cloudinary';

const hideAttributes = {
	__v: 0,
	createdAt: 0,
	updatedAt: 0,
};

export const findAll = async (
	req: Request,
	res: ProductResponseType,
	next: NextFunction
) => {
	try {
		const data = await ProductSchema.find({}, hideAttributes);
		return res.status(200).json({
			message: 'Successfully retrieved!',
			data,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const create = async (
	req: ProductRequestType,
	res: NewProductResponseType,
	next: NextFunction
) => {
	try {
		const { name, price, quantity } = req.body;
		const newProduct = new ProductSchema({ name, price, quantity });

		await newProduct.save();

		return res.status(201).json({
			message: 'New Product Created!',
			data: newProduct,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const createProduct = async (
	req: Request,
	res: NewProductResponseType
) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let uploadAPI: UploadApiResponse;
		try {
			uploadAPI = await uploadCloudinary(req.file.path, 'samples');
		} catch (e) {
			return res.status(400).json({ message: 'Bad Request!' });
		}

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const newProduct = await ProductSchema.create({
			images: {
				public_id,
				filename: originalname,
				secure_url,
				format,
				sizeInBytes: bytes,
			},
			...req.body,
		});

		return res.status(201).json({
			message: 'Created new Product!',
			data: newProduct,
		});
	} catch (e) {
		return res.status(500).json({ message: 'Internal Server Errors!' });
	}
};

export const findById = async (
	req: Request,
	res: FindOneProductResponseType,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const data = await ProductSchema.findOne({ _id: id }, hideAttributes);
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const remove = async (
	req: Request,
	res: RemoveProductResponseType,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		let publicId: string | undefined;

		const product = await ProductSchema.findOne({ _id: id });

		if (product !== null && product !== undefined) {
			publicId = product.images.public_id;
		}

		if (publicId != null) {
			await cloudinary.uploader.destroy(publicId);
		}

		await ProductSchema.findByIdAndRemove(id);

		return res.status(200).json({
			message: 'Data successfully removed',
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const update = async (
	req: Request,
	res: FindOneProductResponseType,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const { name, price, quantity } = req.body;

		let uploadAPI: UploadApiResponse;
		let publicId: string | undefined;

		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let product = await ProductSchema.findOne({ _id: id });
		if (product !== null) {
			publicId = product.images.public_id;
		}

		if (publicId != null) {
			await cloudinary.uploader.destroy(publicId);
		}

		// eslint-disable-next-line prefer-const
		uploadAPI = await uploadCloudinary(req.file.path, 'samples');

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const newProduct = {
			name,
			price,
			quantity,
			images: {
				public_id,
				fileName: originalname,
				secure_url,
				sizeInBytes: bytes,
				format,
			},
		};

		product = await ProductSchema.findOneAndUpdate(
			{ _id: id },
			newProduct,
			{ new: true }
		);
		return res.status(200).json({ message: 'Success', data: product });
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};
