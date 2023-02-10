import { Request, Response } from 'express';
import ContactSchema from '../models/contact.schema';

export const findAllMessages = async (req: Request, res: Response) => {
	const messages = await ContactSchema.find({});
	try {
		return res.status(200).json({
			message: 'Data successfully retrieved',
			data: messages,
		});
	} catch (error) {
		return res.status(500).json({ err: error });
	}
};

export const createMessages = async (req: Request, res: Response) => {
	const created = await ContactSchema.create(req.body);
	try {
		return res.status(201).json({
			message: 'Thank you!',
			data: created,
		});
	} catch (error) {
		return res.status(500).json({ messages: 'Something went wrong!' });
	}
};
