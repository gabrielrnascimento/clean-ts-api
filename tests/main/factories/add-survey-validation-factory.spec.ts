import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { type Validation } from '@/presentation/protocols/validation';
import { SchemaValidation } from '@/validation/validators/schema-validation';
import { ValidationSpy } from '../../presentation/mocks';
import { SchemaValidatorSpy } from '../../validation/mocks';
import { makeAddSurveyValidation } from '@/main/factories/controllers';

jest.mock('@/validation/validators/validation-composite');

jest.mock('@/validation/validators/required-field-validation', () => ({
  RequiredFieldValidation: jest.fn().mockImplementation(() => {
    return new ValidationSpy();
  })
}));

jest.mock('@/validation/validators/schema-validation', () => ({
  SchemaValidation: jest.fn().mockImplementation(() => {
    return new ValidationSpy();
  })
}));

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new SchemaValidation(new SchemaValidatorSpy()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
