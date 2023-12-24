import { ValidationComposite } from '@/validation/validators';
import { type Validation } from '@/presentation/protocols/validation';
import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { makeAddSurveySchemaValidation } from '@/main/factories/validations/add-survey/schema-validation';
import { makeAddSurveyRequiredFieldValidation } from '@/main/factories/validations/add-survey/required-field-validation';

jest.mock('../../../../../validation/validators/validation-composite');

jest.mock('@/validation/validators/required-field-validation', () => ({
  RequiredFieldValidation: jest.fn().mockImplementation(() => {
    return {
      fieldName: 'required_field'
    };
  })
}));

jest.mock('@/main/factories/validations/add-survey/schema-validation', () => ({
  makeAddSurveySchemaValidation: jest.fn().mockImplementation(() => {
    return {
      fieldName: 'schame_validation_field'
    };
  })
}));

describe('AddSurveyValidation Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const validations: Validation[] = [];
    validations.push(...makeAddSurveyRequiredFieldValidation());
    validations.push(makeAddSurveySchemaValidation());

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
