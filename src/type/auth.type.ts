import { CookieType, ICookieRequest } from '../interface/cookie';
import { LoginDTO } from '../interface/login';
import { IRegister, IRegisterResponse } from '../interface/register';
import { ResponseEntity, ResponseMessage } from '../interface/response-entity';
import { INewAccessToken } from '../interface/token';
import { LoginUserInput } from '../utility/input-validation';
import { TypedRequest, TypedResponse } from '../utility/typed-controller';

export type RegisterRequestType = TypedRequest<
	Record<string, never>,
	IRegister
>;
export type RegisterResponseType = TypedResponse<
	ResponseMessage | Partial<ResponseEntity<IRegisterResponse>>
>;
export type LoginRequestType = TypedRequest<
	Record<string, never>,
	LoginUserInput
>;
export type LoginResponseType = TypedResponse<
	ResponseMessage | Partial<CookieType> | ResponseEntity<LoginDTO>
>;
export type NewAccessTokenResponseType = TypedResponse<
	ResponseMessage | INewAccessToken
>;
export type RefreshTokenRequestType = TypedRequest<
	Record<string, never>,
	ICookieRequest
>;
export type RefreshTokenResponseType = TypedResponse<
	ResponseMessage | INewAccessToken
>;
export type LogoutRequestType = TypedRequest<
	Record<string, never>,
	ICookieRequest
>;
