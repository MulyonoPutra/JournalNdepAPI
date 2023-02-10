import { Response, NextFunction, Request } from 'express';
import { IUser } from '../interface/user';

export interface UserRequest extends Request {
	user?: IUser;
}

export const RestrictTo =
	(allowed: string) =>
	(req: UserRequest, res: Response, next: NextFunction) => {
		if (allowed === req.user?.role) {
			next();
		} else {
			res.status(403).json({
				message: 'You are not allowed to access this resource',
				code: 403,
			});
		}
	};
