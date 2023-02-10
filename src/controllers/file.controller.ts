import FileSchema, {
	default as File,
	default as fileSchema,
} from '../models/file.schema';
import { Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export const uploadFile = async (req: Request, res: Response) => {
	try {
		if (!req.file)
			return res.status(400).json({ messages: 'No file uploaded!' });

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

		const file = await File.create({
			public_id,
			filename: originalname,
			sizeInBytes: bytes,
			secure_url,
			format,
		});

		return res.status(201).json({
			messages: 'Upload Successfully!',
			data: file,
		});
	} catch (error) {
		return res.status(500).json({ messages: 'Something went wrong!' });
	}
};

export const findFileById = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const file = await File.findById(id);

		if (!file) {
			return res.status(404).json({ message: 'File does not exists!' });
		}

		return res.status(200).json({
			message: 'Data successfully retrieved!',
			data: file,
		});
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error });
	}
};

export const findAll = async (req: Request, res: Response) => {
	try {
		const file = await File.find({});

		if (!file) {
			return res.status(404).json({ message: 'File does not exists!' });
		}

		return res.status(200).json({
			message: 'Data successfully retrieved!',
			data: file,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Something went wrong!', error });
	}
};

export const multipleFields = async (req: Request, res: Response) => {
	try {
		return res.status(201).json({
			message: 'Created!',
		});
	} catch (error) {
		return res.status(500).json({ msg: 'Internal Server Error!' });
	}
};

export const removeFile = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const files = await FileSchema.findById(id);
		const publicId = files?.public_id;

		if (publicId) {
			await cloudinary.uploader.destroy(publicId);
		}

		await fileSchema.findByIdAndRemove(id);
		return res.status(200).json({
			message: 'Removed!',
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};
