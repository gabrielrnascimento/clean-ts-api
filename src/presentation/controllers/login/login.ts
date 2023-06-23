import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, unauthorized, serverError } from '../../helpers/http-helper';
import { type Authentication, type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from './login-protocols';

export class LoginController implements Controller {
  constructor (
    private readonly emaiLValidator: EmailValidator,
    private readonly authentication: Authentication
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredField = ['email', 'password'];
      for (const field of requiredField) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }
      const { email, password } = httpRequest.body;
      const isValid = this.emaiLValidator.isValid(email);
      if (!isValid) return badRequest(new InvalidParamError('email'));
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) return unauthorized();
      return null as unknown as HttpResponse;
    } catch (error) {
      return serverError(error);
    }
  }
}
