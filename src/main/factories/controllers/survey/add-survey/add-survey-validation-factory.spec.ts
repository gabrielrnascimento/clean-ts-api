import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { type Validation } from '@/presentation/protocols/validation';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { SchemaValidation } from '@/validation/validators/schema-validation';
import { type SchemaValidator } from '@/validation/protocols/schema-validator';

const makeSchemaValidatorStub = (): SchemaValidator => {
  class ValidatorStub implements SchemaValidator {
    validateSchema (input: any): null {
      return null;
    }
  }
  return new ValidatorStub();
};

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

jest.mock('@/validation/validators/validation-composite');

jest.mock('@/validation/validators/required-field-validation', () => ({
  RequiredFieldValidation: jest.fn().mockImplementation(() => {
    return makeValidationStub();
  })
}));

jest.mock('@/validation/validators/schema-validation', () => ({
  SchemaValidation: jest.fn().mockImplementation(() => {
    return makeValidationStub();
  })
}));

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new SchemaValidation(makeSchemaValidatorStub()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
