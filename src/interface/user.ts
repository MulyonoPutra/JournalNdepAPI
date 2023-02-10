import { Document } from 'mongoose';
import { Images } from './images';
import { Request } from 'express';
import { Address } from './address';

export interface IUser extends Document {
	username: string;
	account: string;
	password: string;
	role: string;
	refreshToken: string;
	phone: number;
	dob: string;
	description: string;
	avatar: string;
	images: Images;
	address: Address;
	_doc: object;
}

export interface IUserDetails extends IUser {
	_id: string;
}

export interface UserRequest extends Request {
	user?: IUser;
}
