import { throwError } from '../../domain/mocks';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidatorSpy } from '../mocks';
import { EmailValidation } from '@/validation/validators';

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
};

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation('email', emailValidatorSpy);
  return {
    sut,
    emailValidatorSpy
  };
};

describe('EmailValidation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.result = false;

    const error = sut.validate({ email: 'any_email@mail.com' });

    expect(error).toEqual(new InvalidParamError('email'));
  });
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut();

    sut.validate({ email: 'any_email@mail.com' });

    expect(emailValidatorSpy.email).toBe('any_email@mail.com');
  });

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut();

    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError);

    expect(sut.validate).toThrow();
  });
});
