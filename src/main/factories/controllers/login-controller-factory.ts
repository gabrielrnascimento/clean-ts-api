import { LoginController } from '@/presentation/controllers';
import { type Controller } from '@/presentation/protocols';
import { makeDbAuthentication } from '../usecases';
import { makeLoginValidation } from './login-validation-factory';
import { makeLogControllerDecorator } from '../decorators';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation());
  return makeLogControllerDecorator(controller);
};
