import { TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Districts, Province, Regencies, Villages } from '../interface/address';
import { Errors } from '../controllers/address.controller';

export type AddressResponseType = TypedResponse<
	| Errors
	| ResponseMessage
	| ResponseEntity<Province[]>
	| ResponseEntity<Regencies[]>
	| ResponseEntity<Districts[]>
	| ResponseEntity<Villages[]>
>;
