import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { type Validation } from '@/presentation/protocols/validation';
import Joi from 'joi';
import { type SurveyModel } from '@/domain/models/survey';
import { SchemaJoiAdapter } from '@/infra/validators/schema-joi-adapter';
import { SchemaValidation } from '@/validation/validators/schema-validation';

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
