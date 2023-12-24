import Joi, { type ObjectSchema, ValidationError } from 'joi';
import { SchemaJoiAdapter } from './schema-joi-adapter';

jest.mock('Joi', () => ({
  object (): any {
    return {
      validate (value: any): any {
        return {
          value: {}
        };
      }
    };
  },
  string (): any {
    return {
      required (): any {
        return {};
      }
    };
  },
  required (): any {
    return {};
  },
  ValidationError: class ValidationError {
    message: string;
    details: any;
    _original: any;
    constructor (message: string, details: any, original: any) {
      this.message = message;
      this.details = details;
      this._original = original;
    }
  }
}));

const makeJoiSchema = (): ObjectSchema => {
  return Joi.object({
    any_field: Joi.string().required(),
    any_other_field: Joi.string().required()
  });
};

type SutTypes = {
  sut: SchemaJoiAdapter
  joiSchemaStub: ObjectSchema
};

const makeSut = (): SutTypes => {
  const joiSchemaStub = makeJoiSchema();
  const sut = new SchemaJoiAdapter(joiSchemaStub);
  return {
    sut,
    joiSchemaStub
  };
};

describe('SchemaJoiAdapter', () => {
  test('should call joi validate with correct values', () => {
    const { sut, joiSchemaStub } = makeSut();
    const validateSpy = jest.spyOn(joiSchemaStub, 'validate');
    sut.validateSchema({ any_other_field: 'any_other_value' });
    expect(validateSpy).toHaveBeenCalledWith({ any_other_field: 'any_other_value' });
  });

  test('should return a message if joi validate fails', () => {
    const { sut, joiSchemaStub } = makeSut();
    jest.spyOn(joiSchemaStub, 'validate').mockReturnValueOnce({ value: {}, error: new ValidationError('"any_value" is required', [], 'original_value') });
    const error = sut.validateSchema({ any_other_field: 'any_other_value' });
    expect(error).toEqual('"any_value" is required');
  });

  test('should return null if joi validate succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validateSchema({ any_field: 'any_value', any_other_field: 'any_other_value' });
    expect(error).toBe(null);
  });
});
