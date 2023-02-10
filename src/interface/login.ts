import { IUser } from './user';
import { Images } from './images';
import { Address } from './address';

export interface ILogin {
	account: string;
	password: string;
}

export interface ILoginResponse {
	user: IUser | undefined;
	accessToken: string;
}

export interface LoginDTO {
	accessToken: string;
	user: UserDTO | undefined;
}

export interface UserDTO {
	_id: string;
	username: string;
	account: string;
	role: string;
	phone: number;
	dob: string;
	description: string;
	images: Images;
	avatar: string;
	address: Address;
}
