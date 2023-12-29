import { DbAuthentication } from './db-authentication';
import { mockAuthenticationParams, throwError } from '@/domain/test';
import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '@/data/test';

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  };
};

describe('DbAuthentication', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const loadByEmail = jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail');

    await sut.auth(mockAuthenticationParams());

    expect(loadByEmail).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy } = makeSut();

    await sut.auth(mockAuthenticationParams());

    expect(hashComparerSpy.value).toBe('any_password');
    expect(hashComparerSpy.hash).toBe('any_password');
  });

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, 'compare')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBeNull();
  });

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy } = makeSut();

    await sut.auth(mockAuthenticationParams());

    expect(encrypterSpy.value).toBe('any_id');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test('should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut();

    const accessToken = await sut.auth(mockAuthenticationParams());

    expect(accessToken).toBe(encrypterSpy.result);
  });

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut();
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());

    await expect(promise).rejects.toThrow();
  });

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, encrypterSpy, updateAccessTokenRepositorySpy } = makeSut();

    await sut.auth(mockAuthenticationParams());

    expect(updateAccessTokenRepositorySpy.id).toBe('any_id');
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.result);
  });
});
