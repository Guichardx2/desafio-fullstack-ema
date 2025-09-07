/**
 * Represents the structure of a successful response.
 * 
 * @template T - The type of the data included in the response.
 * 
 * @property success - Indicates whether the operation was successful (always `true` for success).
 * @property status - The HTTP status code of the response.
 * @property data - The data returned in the response (optional).
 * @property message - A descriptive message about the response (optional).
 * @property timestamp - The timestamp when the response was generated.
 */
export interface SuccessResponse<T> {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  timestamp: Date;
}