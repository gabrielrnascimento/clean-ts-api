import { SchemaValidation } from './schema-validation';
import { type SchemaValidator } from '@/validation/protocols/schema-validator';
import { mockSchemaValidator } from '@/validation/test';
import { InvalidSchemaError } from '@/presentation/errors/invalid-schema-error';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: SchemaValidation
  schemaValidatorStub: SchemaValidator
  mockField: any
};

const makeSut = (): SutTypes => {
  const schemaValidatorStub = mockSchemaValidator();
  const mockField = {
    any_field: 'any_value',
    any_other_field: 'any_other_value'
  };
  const sut = new SchemaValidation(schemaValidatorStub);
  return {
    sut,
    schemaValidatorStub,
    mockField
  };
};

describe('SchemaValidation', () => {
  test('should call SchemaValidator with correct values', () => {
    const { sut, schemaValidatorStub, mockField } = makeSut();
    const isValidSpy = jest.spyOn(schemaValidatorStub, 'validateSchema');
    sut.validate(mockField);
    expect(isValidSpy).toHaveBeenCalledWith(mockField);
  });

  test('should return an InvalidSchemaError if SchemaValidator returns false', () => {
    const { sut, schemaValidatorStub } = makeSut();
    jest.spyOn(schemaValidatorStub, 'validateSchema').mockReturnValueOnce('"any_field" is required');
    const mockField = {
      any_other_field: 'any_other_value'
    };
    const error = sut.validate(mockField);
    expect(error).toEqual(new InvalidSchemaError('"any_field" is required'));
  });

  test('should throw if SchemaValidator throws', () => {
    const { sut, schemaValidatorStub } = makeSut();
    jest.spyOn(schemaValidatorStub, 'validateSchema').mockImplementationOnce(throwError);
    expect(sut.validate).toThrow();
  });

  test('should return null if SchemaValidator returns true', () => {
    const { sut, mockField } = makeSut();
    const error = sut.validate(mockField);
    expect(error).toBe(null);
  });
});
