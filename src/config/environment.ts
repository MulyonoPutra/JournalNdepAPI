import dotenv from 'dotenv';

dotenv.config();

const {
	MONGODB_URL,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	RANDOM_AVATAR,
	CLOUDINARY_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	REGION_API,
} = process.env;
export const Environment = {
	db: `${MONGODB_URL}`,
	accessTokenSecret: `${ACCESS_TOKEN_SECRET}`!,
	refreshTokenSecret: `${REFRESH_TOKEN_SECRET}`!,
	randomAvatar: `${RANDOM_AVATAR}`,
	cloudinaryName: `${CLOUDINARY_NAME}`,
	cloudinaryApiKey: `${CLOUDINARY_API_KEY}`,
	cloudinaryApiSecret: `${CLOUDINARY_API_SECRET}`,
	regionAPI: `${REGION_API}`,
};
