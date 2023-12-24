import { ValidationComposite } from '@/validation/validators';
import { type Validation } from '@/presentation/protocols/validation';
import { makeAddSurveySchemaValidation } from '@/main/factories/validations/add-survey/schema-validation';
import { makeAddSurveyRequiredFieldValidation } from '@/main/factories/validations/add-survey/required-field-validation';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  validations.push(...makeAddSurveyRequiredFieldValidation());
  validations.push(makeAddSurveySchemaValidation());
  return new ValidationComposite(validations);
};
