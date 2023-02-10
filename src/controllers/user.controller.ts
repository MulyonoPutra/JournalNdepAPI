/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from 'express';

import { IUserDetails } from '../interface/user';
import UserSchema from '../models/user.schema';
import { FindOneUserResponseType, UserResponseType } from '../type/user.type';
import AppError from '../utility/app-error';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { uploadCloudinary } from '../utility/upload-cloudinary';

const hideAttributes = {
	__v: 0,
	createdAt: 0,
	updatedAt: 0,
	password: 0,
	refreshToken: 0,
};

export const findAll = async (
	req: Request,
	res: UserResponseType,
	next: NextFunction
) => {
	try {
		const data: IUserDetails[] = await UserSchema.find({}, hideAttributes);
		return res.status(200).json({
			message: 'Successfully retrieved!',
			data,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findById = async (
	req: Request,
	res: FindOneUserResponseType,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const data = await UserSchema.findOne({ _id: id }, hideAttributes);
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data,
		});
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const update = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const hideProperties = [
		'-createdAt',
		'-updatedAt',
		'-__v',
		'-password',
		'-refreshToken',
		'-images',
	];

	try {
		const { id } = req.params;
		const { username, phone, dob, description } = req.body;
		let uploadAPI: UploadApiResponse;
		let publicId: string | undefined;

		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded!' });
		}

		let user = await UserSchema.findOne({ _id: id });

		if (user !== null) {
			publicId = user.images.public_id;
		}

		if (publicId !== undefined && publicId !== null) {
			await cloudinary.uploader.destroy(publicId);
		}

		uploadAPI = await uploadCloudinary(req.file.path, 'samples');

		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const newUser = {
			username,
			phone,
			dob,
			description,
			avatar: secure_url,
			images: {
				public_id,
				fileName: originalname,
				secure_url,
				sizeInBytes: bytes,
				format,
			},
		};

		user = await UserSchema.findOneAndUpdate({ _id: id }, newUser, {
			new: true,
		}).select(hideProperties);
		return res.status(200).json({ message: 'Success', data: user });
	} catch (e) {
		return next(new AppError('Internal Server Error!', 500));
	}
};
