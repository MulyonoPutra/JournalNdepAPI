import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { About, Features, Hero } from '../interface/content';

export type ContentResponseType = TypedResponse<
	| ResponseMessage
	| ResponseEntity<Hero>
	| ResponseEntity<Features>
	| ResponseEntity<About>
>;
export type ContentRequestType = TypedRequest<
	Record<string, never>,
	Hero | Features | About
>;
