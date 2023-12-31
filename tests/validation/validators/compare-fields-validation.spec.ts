import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from '@/validation/validators';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare');
};

describe('CompareFieldsValidation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'invalid_value'
    });
    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  test('should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    });
    expect(error).toBeFalsy();
  });
});
