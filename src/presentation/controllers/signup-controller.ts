import { type Validation, type Controller, type HttpResponse } from '../protocols';
import { badRequest, forbidden, ok, serverError } from '../helpers';
import { type AddAccount, type Authentication } from '@/domain/usecases';
import { EmailInUseError } from '../errors';

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = request;

      const isValid = await this.addAccount.add({
        name,
        email,
        password
      });

      if (!isValid) {
        return forbidden(new EmailInUseError());
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password
      });

      return ok(authenticationModel);
    } catch (error) {
      return serverError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  };
}
