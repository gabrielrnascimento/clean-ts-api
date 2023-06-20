import { type HttpResponse, type HttpRequest } from '../protocols/http';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    let body: any;
    if (!httpRequest.body.name) {
      body = new Error('Missing param: name');
    }
    if (!httpRequest.body.email) {
      body = new Error('Missing param: email');
    }
    return {
      statusCode: 400,
      body
    };
  }
}
