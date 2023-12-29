import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators';
import { type Validation } from '@/presentation/protocols/validation';
import { ValidationSpy } from '../../presentation/mocks';
import { EmailValidatorSpy } from '../../validation/mocks';
import { makeLoginValidation } from '@/main/factories/controllers';

jest.mock('@/validation/validators/validation-composite');

jest.mock('@/validation/validators/required-field-validation', () => ({
  RequiredFieldValidation: jest.fn().mockImplementation(() => {
    return new ValidationSpy();
  })
}));

jest.mock('@/validation/validators/email-validation', () => ({
  EmailValidation: jest.fn().mockImplementation(() => {
    return new ValidationSpy();
  })
}));

describe('LoginValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', new EmailValidatorSpy()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
