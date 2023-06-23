import { type Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { type HttpRequest, type HttpResponse, type Controller, type EmailValidator } from '../../protocols';

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
      await this.authentication.auth(email, password);
      return null as unknown as HttpResponse;
    } catch (error) {
      return serverError(error);
    }
  }
}
