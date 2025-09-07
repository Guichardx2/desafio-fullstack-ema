/**
 * Represents the structure of an error response.
 * 
 * @property success - Indicates whether the operation was successful (always `false` for errors).
 * @property status - The HTTP status code of the error.
 * @property message - A descriptive message about the error.
 * @property timestamp - The timestamp when the error occurred.
 */
export interface ErrorResponse{
    success: boolean,
    status: number,
    message: string,
    timestamp: Date
}