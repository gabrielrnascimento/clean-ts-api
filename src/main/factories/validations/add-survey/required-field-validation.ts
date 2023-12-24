import { type Validation } from '@/presentation/protocols';
import { RequiredFieldValidation } from '@/validation/validators';

export const makeAddSurveyRequiredFieldValidation = (): Validation[] => {
  const validations: Validation[] = [];
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return validations;
};
