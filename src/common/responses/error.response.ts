import { BaseResponse } from "./base.response";

export class ErrorResponse extends BaseResponse {

  statusCode: number;
  errorCode?: string;

  constructor(
    message: string,
    statusCode = 500,
    error: string,
  ) {
    super(false, message)
    this.statusCode = statusCode;
    this.errorCode = error;
  }

}