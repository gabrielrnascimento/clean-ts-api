import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { type Validation } from '../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { type EmailValidator } from '../../../presentation/protocols';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmaiLValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmaiLValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
