import { InvalidParamError, MissingParamError } from '../../errors/';
import { badRequest, serverError } from '../../helpers/http-helper';
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse, type AddAccount } from './signup-protocols';

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) { }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      let body: any;
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      this.addAccount.add({
        name,
        email,
        password
      });

      return badRequest(body);
    } catch (error) {
      return serverError();
    }
  }
}
