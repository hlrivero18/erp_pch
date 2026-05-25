import { HttpException } from "@nestjs/common";
import { Catch } from "@nestjs/common";
import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ErrorResponse } from "../responses/error.response";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json(
      new ErrorResponse("Fallo en la API", status, exception.message)
    );
  }
}