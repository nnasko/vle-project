import { ApiError } from "next/dist/server/api-utils";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiErrorResponse extends ApiError {
  message: string;
  statusCode: number;
}

export type ApiResult<T> = Promise<ApiResponse<T>>;
