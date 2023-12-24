import { type SurveyModel } from '@/domain/models/survey';
import { SchemaJoiAdapter } from '@/infra/validators/schema-joi-adapter';
import { type Validation } from '@/presentation/protocols';
import { SchemaValidation } from '@/validation/validators/schema-validation';
import Joi from 'joi';

export const makeAddSurveySchemaValidation = (): Validation => {
  const schema = Joi.object<SurveyModel>({
    question: Joi.string().required(),
    answers: Joi.array().items(
      Joi.object({
        image: Joi.string().optional(),
        answer: Joi.string().required()
      })).required()
  });
  const schemaValidator = new SchemaJoiAdapter(schema);
  return new SchemaValidation(schemaValidator);
};
