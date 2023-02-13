import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Contact } from '../interface/contact';

export type ContactResponseType = TypedResponse<
	ResponseMessage | ResponseEntity<Contact[]> | ResponseEntity<Contact>
>;
export type ContactRequestType = TypedRequest<Record<string, never>, Contact>;
