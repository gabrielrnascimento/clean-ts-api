import { DbAddAccount } from '@/data/usecases';
import { mockAddAccountParams, throwError } from '../../domain/mocks';
import { AddAccountRepositorySpy, HasherSpy, LoadAccountByEmailRepositorySpy } from '../mocks';

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

    const isValid = sut.add(mockAddAccountParams());

    await expect(isValid).rejects.toThrow();
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

  test('should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    addAccountRepositorySpy.result = false;

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(false);
  });

  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError);

    const isValid = sut.add(mockAddAccountParams());

    await expect(isValid).rejects.toThrow();
  });

  test('should return true if LoadAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut();

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(true);
  });

  test('should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.result = {
      id: 'any_id',
      name: 'any_name',
      password: 'any_password'
    };

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(false);
  });

  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();

    await sut.add(mockAddAccountParams());

    expect(loadAccountByEmailRepositorySpy.email).toBe('any_email@mail.com');
  });

  test('should return true on success', async () => {
    const { sut } = makeSut();

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(true);
  });
});
