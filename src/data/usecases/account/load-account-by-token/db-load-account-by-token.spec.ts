import { mockAccountModel, throwError } from '@/domain/test';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test';

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
};

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy);
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy
  };
};

describe('DbLoadAccountByToken', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut();
    await sut.load('any_token', 'any_role');
    expect(decrypterSpy.value).toBe('any_token');
  });

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    decrypterSpy.result = null;

    const account = await sut.load('any_token', 'any_role');

    expect(account).toBeNull();
  });

  test('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();

    await sut.load('any_token', 'any_role');

    expect(loadAccountByTokenRepositorySpy.token).toBe('any_token');
    expect(loadAccountByTokenRepositorySpy.role).toBe('any_role');
  });

  test('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.result = null;

    const account = await sut.load('any_token', 'any_role');

    expect(account).toBeNull();
  });

  test('should return null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);

    const account = await sut.load('any_token', 'any_role');

    expect(account).toBeNull();
  });

  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError);

    const account = sut.load('any_token', 'any_role');

    await expect(account).rejects.toThrow();
  });

  test('should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.load('any_token', 'any_role');

    expect(account).toEqual(mockAccountModel());
  });
});
