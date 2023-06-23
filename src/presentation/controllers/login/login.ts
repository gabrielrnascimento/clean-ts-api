import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { type HttpRequest, type HttpResponse, type Controller, type EmailValidator } from '../../protocols';

export class LoginController implements Controller {
  constructor (private readonly emaiLValidator: EmailValidator) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) return await new Promise(resolve => { resolve(badRequest(new MissingParamError('email'))); });
      if (!password) return await new Promise(resolve => { resolve(badRequest(new MissingParamError('password'))); });
      const isValid = this.emaiLValidator.isValid(email);
      if (!isValid) return await new Promise(resolve => { resolve(badRequest(new InvalidParamError('email'))); });
      return null as unknown as HttpResponse;
    } catch (error) {
      return serverError(error);
    }
  }
}
