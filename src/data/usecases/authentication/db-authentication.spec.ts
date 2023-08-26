import { DbAuthentication } from './db-authentication';
import {
  type AccountModel,
  type LoadAccountByEmailRepository,
  type AuthenticationModel,
  type HashComparer,
  type Encrypter,
  type UpdateAccessTokenRepository
} from './db-authentication-protocols';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'any_token';
    }
  }
  return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return null;
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  EncrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const EncrypterStub = makeEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    EncrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    EncrypterStub,
    updateAccessTokenRepositoryStub
  };
};

describe('DbAuthentication', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth(makeFakeAuthentication());

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(makeFakeAuthentication());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => { resolve(false); }));

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBeNull();
  });

  test('should call Encrypter with correct id', async () => {
    const { sut, EncrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(EncrypterStub, 'encrypt');

    await sut.auth(makeFakeAuthentication());

    expect(encryptSpy).toHaveBeenCalledWith('any_id');
  });

  test('should throw if Encrypter throws', async () => {
    const { sut, EncrypterStub } = makeSut();
    jest.spyOn(EncrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });

  test('should return a token on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuthentication());

    expect(accessToken).toBe('any_token');
  });

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');

    await sut.auth(makeFakeAuthentication());

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
  });

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()); }));

    const promise = sut.auth(makeFakeAuthentication());

    await expect(promise).rejects.toThrow();
  });
});
