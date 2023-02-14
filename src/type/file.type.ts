import { TypedRequest, TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Images } from '../interface/images';

export type FileResponseType = TypedResponse<ResponseMessage | ResponseEntity<Images[]> | ResponseEntity<Images>>;
export type FileRequestType = TypedRequest<Record<string, never>, Images>;
