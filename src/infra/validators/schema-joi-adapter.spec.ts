import Joi, { type ObjectSchema, ValidationError } from 'joi';
import { SchemaJoiAdapter } from './schema-joi-adapter';

jest.mock('joi', () => ({
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

const mockJoiSchema = (): ObjectSchema => {
  return Joi.object({
    any_field: Joi.string().required(),
    any_other_field: Joi.string().required()
  });
};

type SutTypes = {
  sut: SchemaJoiAdapter
  joiSchemaMock: ObjectSchema
};

const makeSut = (): SutTypes => {
  const joiSchemaMock = mockJoiSchema();
  const sut = new SchemaJoiAdapter(joiSchemaMock);
  return {
    sut,
    joiSchemaMock
  };
};

describe('SchemaJoiAdapter', () => {
  test('should call joi validate with correct values', () => {
    const { sut, joiSchemaMock } = makeSut();
    const validateSpy = jest.spyOn(joiSchemaMock, 'validate');
    sut.validateSchema({ any_other_field: 'any_other_value' });
    expect(validateSpy).toHaveBeenCalledWith({ any_other_field: 'any_other_value' });
  });

  test('should return a message if joi validate fails', () => {
    const { sut, joiSchemaMock } = makeSut();
    jest.spyOn(joiSchemaMock, 'validate').mockReturnValueOnce({ value: {}, error: new ValidationError('"any_value" is required', [], 'original_value') });
    const error = sut.validateSchema({ any_other_field: 'any_other_value' });
    expect(error).toEqual('"any_value" is required');
  });

  test('should return null if joi validate succeeds', () => {
    const { sut } = makeSut();
    const error = sut.validateSchema({ any_field: 'any_value', any_other_field: 'any_other_value' });
    expect(error).toBe(null);
  });
});
