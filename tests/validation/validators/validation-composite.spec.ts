import { MissingParamError } from '@/presentation/errors';
import { ValidationSpy } from '../../presentation/mocks';
import { ValidationComposite } from '@/validation/validators';

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
};

const makeSut = (): SutTypes => {
  const validationSpies = [
    new ValidationSpy(),
    new ValidationSpy()
  ];
  const sut = new ValidationComposite(validationSpies);
  return {
    sut,
    validationSpies
  };
};

describe('ValidationComposite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut();
    validationSpies[1].result = new MissingParamError('field');

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  test('should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut();
    validationSpies[0].result = new Error();
    validationSpies[1].result = new MissingParamError('field');

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  test('should not return if validation succeeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
