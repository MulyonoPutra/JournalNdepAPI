import { NextFunction, Request } from 'express';
import ContactSchema from '../models/contact.schema';
import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Contact } from '../interface/contact';
import AppError from '../utility/app-error';

export type ContactResponseType = TypedResponse<
	ResponseMessage | ResponseEntity<Contact[]> | ResponseEntity<Contact>
>;
export type ContactRequestType = TypedRequest<Record<string, never>, Contact>;

export const findAllMessages = async (
	req: Request,
	res: ContactResponseType,
	next: NextFunction
) => {
	const messages = (await ContactSchema.find({})) as Contact[];
	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: messages,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};

export const createMessages = async (
	req: ContactRequestType,
	res: ContactResponseType,
	next: NextFunction
) => {
	const messages = await ContactSchema.create(req.body);
	try {
		return res.status(201).json({
			message: 'Thank you!',
			data: messages,
		});
	} catch (error) {
		return next(new AppError('Internal Server Error!', 500));
	}
};
