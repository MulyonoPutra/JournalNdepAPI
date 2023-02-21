import { TypedResponse } from '../utility/typed-controller';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { Articles } from '../interface/articles';

export type ArticlesResponseType = TypedResponse<ResponseMessage | ResponseEntity<Articles[]> | ResponseEntity<Articles>>;
