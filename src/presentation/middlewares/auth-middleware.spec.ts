import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { AuthMiddleware } from './auth-middleware';
import { type HttpRequest } from './auth-middleware-protocols';
import { LoadAccountByTokenSpy } from '@/domain/test';

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
});

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
};

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy();
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role);
  return {
    sut,
    loadAccountByTokenSpy
  };
};

describe('AuthMiddleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenSpy } = makeSut(role);

    await sut.handle(mockRequest());

    expect(loadAccountByTokenSpy.accessToken).toBe('any_token');
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.result = null;

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest.spyOn(loadAccountByTokenSpy, 'load')
      .mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
  });
});
