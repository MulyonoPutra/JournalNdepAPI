import { TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Category } from '../interface/category';

export type CategoryResponseType = TypedResponse<
	ResponseMessage | ResponseEntity<Category[]> | ResponseEntity<Category>
>;
