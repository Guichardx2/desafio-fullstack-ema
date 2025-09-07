//NestJS imports
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

//DTO imports
import { SuccessResponseDTO } from '../dtos/success-response.dto';

/**
 * Interceptor responsible for transforming the response into a standardized success response format.
 */
@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {

    /**
     * Intercepts the outgoing response and transforms it into a `SuccessResponseDto`.
     * 
     * @param context - The execution context of the request.
     * @param next - The next handler in the request pipeline.
     * @returns An observable containing the transformed response.
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const statusCode = context.switchToHttp().getResponse().statusCode

        return next.handle().pipe(
            map((data) => {

                const message = data?.message;

                const payload = data?.data ?? (message ? undefined : data);


                return new SuccessResponseDTO(
                    statusCode,
                    payload,
                    message || 'Operação realizada com sucesso',
                )
            }),
        );
    }
}