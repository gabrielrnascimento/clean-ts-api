import { type Controller } from '@/presentation/protocols';
import { makeDbAddAccount, makeDbAuthentication } from '../usecases';
import { SignUpController } from '@/presentation/controllers';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeLogControllerDecorator } from '../decorators';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(controller);
};
