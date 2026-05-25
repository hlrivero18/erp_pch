import { BaseResponse } from "./base.response";

export class SuccessResponse<T> extends BaseResponse {
  readonly data: T;
  readonly statusCode: number;

  constructor(message: string, data: T, statusCode = 200) {
    super(true, message);
    this.data = data;
    this.statusCode = statusCode;
  }
}