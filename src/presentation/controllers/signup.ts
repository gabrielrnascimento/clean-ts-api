import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest, serverError } from '../helpers/http-helper';
import { type Controller } from '../protocols/controller';
import { type emailValidator } from '../protocols/email-validator';
import { type HttpResponse, type HttpRequest } from '../protocols/http';

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: emailValidator) { }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      let body: any;
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          body = new MissingParamError(field);
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      return badRequest(body);
    } catch (error) {
      return serverError();
    }
  }
}
