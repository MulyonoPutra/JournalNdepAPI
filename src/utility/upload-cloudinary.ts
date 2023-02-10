import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

export const uploadCloudinary = async (
	filePath: string,
	folder: string
): Promise<UploadApiResponse> => {
	return await cloudinary.uploader.upload(filePath, {
		folder,
		resource_type: 'auto',
	});
};
