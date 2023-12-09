import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../../presentation/helpers/validators';
import { type EmailValidator } from '../../../../presentation/protocols';
import { type Validation } from '../../../../presentation/protocols/validation';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('../../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmaiLValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmaiLValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
