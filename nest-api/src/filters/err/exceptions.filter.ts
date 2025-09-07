//NestJS and Fastify imports
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

// DTO imports
import { ErrorResponseDTO } from '../dtos/error-response.dto';


/**
 * Global exception filter for handling and formatting exceptions in the application.
 * 
 * This filter catches all exceptions, determines their type, and formats the response
 * into a standardized error response format using `ErrorResponseDto`.
 */
@Catch()
export class ExceptionsFilter implements ExceptionFilter {

    /**
     * Handles the caught exception and sends a formatted error response.
     * 
     * @param exception - The exception that was thrown.
     * @param host - The arguments host containing the execution context.
     */
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();

        let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: any = 'Internal server error';
        let path: string = request.url;

        // Handle HttpException and extract status and message
        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {

                message = exceptionResponse;

            } else if (

                typeof exceptionResponse === 'object' &&
                (exceptionResponse as Record<string, any>)['message']

            ) {

                message = (exceptionResponse as Record<string, any>)['message'];

            } else {

                message = exceptionResponse;
            }
            
        } else if (exception?.message) {
            // Handle generic exceptions
            message = exception.message;
        }

        // Create a standardized error response
        const errorResponse = new ErrorResponseDTO(status, message, path);

        // Send the error response
        response.status(status).send(errorResponse);
    }
}