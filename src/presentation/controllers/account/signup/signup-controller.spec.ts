import { type HttpRequest, EmailInUseError, MissingParamError, badRequest, forbidden, ok, serverError } from './signup-controller-protocols';
import { SignUpController } from './signup-controller';
import { AddAccountSpy, AuthenticationSpy, throwError } from '@/domain/test';
import { ValidationSpy } from '@/presentation/test';

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
};

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy);
  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  };
};

describe('SignUpController', () => {
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(addAccountSpy.addAccountParams).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut();
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.result = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok(authenticationSpy.result));
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

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();

    await sut.handle(mockRequest());

    expect(authenticationSpy.authenticationParams).toEqual({
      email: 'any_email@mail.com',
      password: 'any_password'
    });
  });

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);

    const response = await sut.handle(mockRequest());

    expect(response).toEqual(serverError(new Error()));
  });
});
