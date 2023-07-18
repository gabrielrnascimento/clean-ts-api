import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field');
};

describe('RequiredFieldValidation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ another_field: 'any_text' });
    expect(error).toEqual(new MissingParamError('any_field'));
  });

  test('should not return if validation succeeds', () => {
    const sut = makeSut();
    const error = sut.validate({ any_field: 'any_text' });
    expect(error).toBeFalsy();
  });
});
