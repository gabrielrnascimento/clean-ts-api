import { MissingParamError } from '../errors/missing-param-error';
import { type HttpResponse, type HttpRequest } from '../protocols/http';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let body: any;
    if (!httpRequest.body.name) {
      body = new MissingParamError('name');
    }
    if (!httpRequest.body.email) {
      body = new MissingParamError('email');
    }
    return {
      statusCode: 400,
      body
    };
  }
}
