import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Environment } from '../config/environment';
import { IDecoded } from '../interface/decoded';
import { IUser } from '../interface/user';
import UserSchema from '../models/user.schema';
import { avatarGenerator } from '../utility/avatar-generator';
import { errorResponse } from '../utility/error-response';
import {
	generateAccessToken,
	generateRefreshToken,
} from '../utility/generate-token';
import {
	LoginRequestType,
	LoginResponseType,
	LogoutRequestType,
	NewAccessTokenResponseType,
	RefreshTokenRequestType,
	RefreshTokenResponseType,
	RegisterRequestType,
	RegisterResponseType,
} from '../type/auth.type';
import { UserDTO } from '../interface/login';

export const register =
	(role?: string) =>
	async (req: RegisterRequestType, res: RegisterResponseType) => {
		try {
			const { username, account, password } = req.body;
			const users = await UserSchema.findOne({ account });

			if (users) {
				return res
					.status(400)
					.json({ message: 'User already exists!' });
			}

			const salt = await bcrypt.genSalt(Number(10));
			const hashPassword = await bcrypt.hash(password, salt);
			const avatar = avatarGenerator();

			await new UserSchema({
				username,
				account,
				password: hashPassword,
				avatar,
				role,
			}).save();

			const data = { username, account };

			return res.status(200).json({
				message: 'Success',
				data,
			});
		} catch (e) {
			return errorResponse(e, res);
		}
	};

export const login = async (req: LoginRequestType, res: LoginResponseType) => {
	try {
		const { account, password } = req.body;
		const user = await UserSchema.findOne({ account });
		if (!user) {
			return res.status(400).json({
				message: 'User not found!',
			});
		}

		await loginSuccessful(user, password, res);
	} catch (e) {
		return errorResponse(e, res);
	}
};

const loginSuccessful = async (
	user: IUser,
	passwords: string,
	res: LoginResponseType
) => {
	const isValid = await bcrypt.compare(passwords, user.password);

	// Check if password is valid
	if (!isValid) {
		return res.status(500).json({ message: 'Password is incorrect!' });
	}

	const accessToken = generateAccessToken({ id: user._id });
	const refreshToken = generateRefreshToken({ id: user._id });

	await UserSchema.findOneAndUpdate({ _id: user._id }, { refreshToken });

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	});

	const {
		_id,
		images,
		username,
		account,
		role,
		phone,
		dob,
		description,
		avatar,
		address,
	} = user;

	const userDTO: UserDTO = {
		_id,
		images,
		username,
		account,
		role,
		phone,
		dob,
		description,
		avatar,
		address,
	};

	return res.status(200).json({
		message: 'Success',
		data: { accessToken, user: userDTO },
	});
};

export const refreshToken = async (
	req: RefreshTokenRequestType,
	res: RefreshTokenResponseType
) => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			return res.status(200).json({
				message: 'Refresh token not found! Please login again.',
			});
		}

		const decoded = jwt.verify(
			token,
			`${Environment.refreshTokenSecret}`
		) as IDecoded;
		if (!decoded.id) {
			return res.status(400).json({
				message: 'Refresh token is invalid!',
			});
		}

		const user = await UserSchema.findOne({ _id: decoded.id }).select(
			'+password'
		);
		if (!user) {
			return res.status(400).json({
				message: 'This account does not exist!',
			});
		}

		const newAccessToken = generateAccessToken({ id: user._id });

		return res.status(200).json({ accessToken: newAccessToken });
	} catch (e) {
		console.log(e);
	}
};

export const logout = async (
	req: LogoutRequestType,
	res: NewAccessTokenResponseType
) => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			return res.sendStatus(204);
		}

		const user = await UserSchema.find({ refreshToken: token });
		if (!user) {
			return res.status(400).json({
				message: 'User not found!',
			});
		}

		const userId = user[0]?._id;
		await UserSchema.findOneAndUpdate(
			{ _id: userId },
			{ refreshToken: null }
		);
		res.clearCookie('refreshToken');
		return res.status(200).json({ message: 'Successfully logout!' });
	} catch (e) {
		return errorResponse(e, res);
	}
};

// NOTE:
// - https://codevoweb.com/node-typescript-mongodb-jwt-authentication/
// - https://www.bezkoder.com/node-js-mongodb-auth-jwt/
