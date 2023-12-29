import { type SurveyModel } from '@/domain/models/survey';
import { SchemaJoiAdapter } from '@/infra/validators';
import { type Validation } from '@/presentation/protocols';
import { RequiredFieldValidation, SchemaValidation, ValidationComposite } from '@/validation/validators';
import Joi from 'joi';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }

  const schema = Joi.object<SurveyModel>({
    question: Joi.string().required(),
    answers: Joi.array().items(
      Joi.object({
        image: Joi.string().optional(),
        answer: Joi.string().required()
      }))
      .required()
  });
  const schemaValidator = new SchemaJoiAdapter(schema);
  validations.push(new SchemaValidation(schemaValidator));

  return new ValidationComposite(validations);
};
