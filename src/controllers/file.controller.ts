import FileSchema from '../models/file.schema';
import { NextFunction, Request } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Images } from '../interface/images';
import AppError from '../utility/app-error';

export type FileResponseType = TypedResponse<
	ResponseMessage | ResponseEntity<Images[]> | ResponseEntity<Images>
>;
export type FileRequestType = TypedRequest<Record<string, never>, Images>;

export const uploadFile = async (
	req: FileRequestType,
	res: FileResponseType,
	next: NextFunction
) => {
	try {
		if (!req.file)
			return res.status(400).json({ message: 'No file uploaded!' });

		let uploadAPI: UploadApiResponse;

		try {
			uploadAPI = await cloudinary.uploader.upload(req.file.path, {
				folder: 'journal-ndep',
				resource_type: 'auto',
			});
		} catch (error) {
			return res.status(400).json({ message: 'Something went wrong!' });
		}
		const { originalname } = req.file;
		const { secure_url, bytes, format, public_id } = uploadAPI;

		const file: Images = await FileSchema.create({
			public_id,
			filename: originalname,
			sizeInBytes: bytes,
			secure_url,
			format,
		});

		return res.status(201).json({
			message: 'Upload Successfully!',
			data: file,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findFileById = async (
	req: Request,
	res: FileResponseType,
	next: NextFunction
) => {
	try {
		const id = req.params.id;
		const file = await FileSchema.findById(id);

		if (!file) {
			return res.status(404).json({ message: 'File does not exists!' });
		}

		return res.status(200).json({
			message: 'Data successfully retrieved!',
			data: file,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const findAll = async (
	req: Request,
	res: FileResponseType,
	next: NextFunction
) => {
	try {
		const file = await FileSchema.find({});

		if (!file) {
			return res.status(404).json({ message: 'File does not exists!' });
		}

		return res.status(200).json({
			message: 'Data successfully retrieved!',
			data: file,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const multipleFields = async (
	req: Request,
	res: FileResponseType,
	next: NextFunction
) => {
	try {
		return res.status(201).json({
			message: 'Created!',
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const removeFile = async (
	req: Request,
	res: FileResponseType,
	next: NextFunction
) => {
	try {
		const { id } = req.params;

		const files = await FileSchema.findById(id);
		const publicId = files?.public_id;

		if (publicId) {
			await cloudinary.uploader.destroy(publicId);
		}

		await FileSchema.findByIdAndRemove(id);
		return res.status(200).json({
			message: 'Removed!',
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};
