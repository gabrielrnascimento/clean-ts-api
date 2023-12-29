import { SchemaValidation } from './schema-validation';
import { SchemaValidatorSpy } from '@/validation/test';
import { InvalidSchemaError } from '@/presentation/errors/invalid-schema-error';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: SchemaValidation
  schemaValidatorSpy: SchemaValidatorSpy
  mockField: any
};

const makeSut = (): SutTypes => {
  const schemaValidatorSpy = new SchemaValidatorSpy();
  const mockField = {
    any_field: 'any_value',
    any_other_field: 'any_other_value'
  };
  const sut = new SchemaValidation(schemaValidatorSpy);
  return {
    sut,
    schemaValidatorSpy,
    mockField
  };
};

describe('SchemaValidation', () => {
  test('should call SchemaValidator with correct values', () => {
    const { sut, schemaValidatorSpy, mockField } = makeSut();

    sut.validate(mockField);

    expect(schemaValidatorSpy.field).toEqual(mockField);
  });

  test('should return an InvalidSchemaError if SchemaValidator returns false', () => {
    const { sut, schemaValidatorSpy } = makeSut();
    schemaValidatorSpy.result = '"any_field" is required';

    const error = sut.validate({
      any_other_field: 'any_other_value'
    });

    expect(error).toEqual(new InvalidSchemaError('"any_field" is required'));
  });

  test('should throw if SchemaValidator throws', () => {
    const { sut, schemaValidatorSpy } = makeSut();
    jest.spyOn(schemaValidatorSpy, 'validateSchema').mockImplementationOnce(throwError);

    expect(sut.validate).toThrow();
  });

  test('should return null if SchemaValidator returns true', () => {
    const { sut, mockField } = makeSut();

    const error = sut.validate(mockField);

    expect(error).toBe(null);
  });
});
