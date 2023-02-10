import mongoose from 'mongoose';
import { IFile } from '../interface/file';

const Schema = mongoose.Schema;

const fileSchema = new Schema(
	{
		public_id: {
			type: String,
			required: true,
		},
		filename: {
			type: String,
			required: true,
		},
		secure_url: {
			type: String,
			required: true,
		},
		format: {
			type: String,
			required: true,
		},
		sizeInBytes: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IFile>('File', fileSchema);
