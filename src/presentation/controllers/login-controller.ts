import { type Validation, type Controller, type HttpResponse } from '../protocols';
import { badRequest, ok, serverError, unauthorized } from '../helpers';
import { type Authentication } from '@/domain/usecases';

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }
      const { email, password } = request;
      const authenticationModel = await this.authentication.auth({
        email,
        password
      });
      if (!authenticationModel) return unauthorized();
      return ok(authenticationModel);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string
    password: string
  };
}
