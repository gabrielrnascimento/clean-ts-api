import { InvalidSchemaError } from '@/presentation/errors/invalid-schema-error';
import { type SchemaValidator } from '../protocols/schema-validator';
import { SchemaValidation } from './schema-validation';

const makeSchemaValidator = (): SchemaValidator => {
  class SchemaValidatorStub implements SchemaValidator {
    validateSchema (field: any): string {
      return null;
    }
  }
  return new SchemaValidatorStub();
};

type SutTypes = {
  sut: SchemaValidation
  schemaValidatorStub: SchemaValidator
  fakeField: any
};

const makeSut = (): SutTypes => {
  const schemaValidatorStub = makeSchemaValidator();
  const fakeField = {
    any_field: 'any_value',
    any_other_field: 'any_other_value'
  };
  const sut = new SchemaValidation(schemaValidatorStub);
  return {
    sut,
    schemaValidatorStub,
    fakeField
  };
};

describe('SchemaValidation', () => {
  test('should call SchemaValidator with correct values', () => {
    const { sut, schemaValidatorStub, fakeField } = makeSut();
    const isValidSpy = jest.spyOn(schemaValidatorStub, 'validateSchema');
    sut.validate(fakeField);
    expect(isValidSpy).toHaveBeenCalledWith(fakeField);
  });

  test('should return an InvalidSchemaError if SchemaValidator returns false', () => {
    const { sut, schemaValidatorStub } = makeSut();
    jest.spyOn(schemaValidatorStub, 'validateSchema').mockReturnValueOnce('"any_field" is required');
    const fakeField = {
      any_other_field: 'any_other_value'
    };
    const error = sut.validate(fakeField);
    expect(error).toEqual(new InvalidSchemaError('"any_field" is required'));
  });

  test('should throw if SchemaValidator throws', () => {
    const { sut, schemaValidatorStub } = makeSut();
    jest.spyOn(schemaValidatorStub, 'validateSchema').mockImplementationOnce(() => { throw new Error(); });
    expect(sut.validate).toThrow();
  });

  test('should return null if SchemaValidator returns true', () => {
    const { sut, fakeField } = makeSut();
    const error = sut.validate(fakeField);
    expect(error).toBe(null);
  });
});
