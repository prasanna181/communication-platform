export type ServiceResponse<T> = SuccessResponse<T> | ErrorResponse;
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: object;
}
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}
