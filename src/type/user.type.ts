import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { IUser, IUserDetails } from '../interface/user';
import { TypedResponse } from '../utility/typed-controller';

export type UserResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<IUserDetails[]>>
>;
export type FindOneUserResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<IUser | null>>
>;
