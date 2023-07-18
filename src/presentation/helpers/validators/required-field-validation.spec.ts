import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredFieldValidation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field');
    const error = sut.validate({ another_field: 'any_text' });
    expect(error).toEqual(new MissingParamError('any_field'));
  });
});
