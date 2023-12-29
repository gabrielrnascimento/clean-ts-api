import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test';
import { DbAddAccount } from './db-add-account';
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '@/data/test';

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  loadAccountByEmailRepositorySpy.result = null;
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy);
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy
  };
};

describe('DbAddAccount', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    await sut.add(mockAddAccountParams());
    expect(hasherSpy.value).toBe('any_password');
  });

  test('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
    const account = sut.add(mockAddAccountParams());
    await expect(account).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values', async () => {
    const { sut, hasherSpy, addAccountRepositorySpy } = makeSut();
    await sut.add(mockAddAccountParams());
    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: hasherSpy.result
    });
  });

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError);
    const account = sut.add(mockAddAccountParams());
    await expect(account).rejects.toThrow();
  });

  test('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    };
    const account = await sut.add(accountData);
    expect(account).toEqual(mockAccountModel());
  });

  test('should null if LoadAccountByEmailRepository returns not null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.result = mockAccountModel();
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    };
    const account = await sut.add(accountData);
    expect(account).toBeNull();
  });

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();

    await sut.add(mockAddAccountParams());

    expect(loadAccountByEmailRepositorySpy.email).toBe('any_email@mail.com');
  });
});
