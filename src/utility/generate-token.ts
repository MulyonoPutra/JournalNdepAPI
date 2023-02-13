import jwt from 'jsonwebtoken';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const generateAccessToken = (payload: object) => {
	return jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, { expiresIn: '10m' });
};

export const generateRefreshToken = (payload: object) => {
	return jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, {
		expiresIn: '1d',
	});
};
