import jwt from 'jsonwebtoken';
import { LoginResponseType } from '../type/auth.type';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const generateAccessToken = (payload: object) => {
	return jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, { expiresIn: '30m' });
};

export const generateRefreshToken = (
	payload: object,
	res: LoginResponseType
) => {
	const refresh = jwt.sign(payload, `${REFRESH_TOKEN_SECRET}`, {
		expiresIn: '30d',
	});

	res.cookie('refreshToken', refresh, {
		httpOnly: true,
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
	});

	return refresh;
};
