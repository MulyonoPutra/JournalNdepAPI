import { model, Schema } from 'mongoose';
import { Contact } from '../interface/contact';

const ContactSchema = new Schema<Contact>({
	name: { type: String, required: true },
	subject: { type: String, required: true },
	email: { type: String, required: true },
	messages: { type: String, required: true },
});

export default model<Contact>('Messages', ContactSchema);
