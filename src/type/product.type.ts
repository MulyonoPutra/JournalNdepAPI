import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { Product } from '../interface/product';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';

export type ProductRequestType = TypedRequest<Record<string, never>, Product>;
export type ProductResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<Product[]>>
>;
export type NewProductResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<Product>>
>;
export type FindOneProductResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<Product | null>>
>;
export type RemoveProductResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<void>>
>;
