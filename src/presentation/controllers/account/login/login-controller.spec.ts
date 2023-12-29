import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper';
import { LoginController } from './login-controller';
import { type HttpRequest } from './login-controller-protocols';
import { AuthenticationSpy, throwError } from '@/domain/test';
import { ValidationSpy } from '@/presentation/test';

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
});

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
};

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(authenticationSpy, validationSpy);
  return {
    sut,
    authenticationSpy,
    validationSpy
  };
};

describe('LoginController', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(authenticationSpy.authenticationParams).toEqual({
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.result = '';

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });

  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validationSpy.input).toBe(httpRequest.body);
  });

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.result = new MissingParamError('any_field');

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
