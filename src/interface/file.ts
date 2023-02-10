import { Document } from 'mongoose';

export interface IFile extends Document {
	public_id: string;
	filename: string;
	secure_url: string;
	format: string;
	sizeInBytes: string;
}
