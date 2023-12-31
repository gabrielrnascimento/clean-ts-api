import { DbAddAccount } from '@/data/usecases';
import { mockAddAccountParams, throwError } from '../../domain/mocks';
import { AddAccountRepositorySpy, HasherSpy, CheckAccountByEmailRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
};

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy();
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy);
  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
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

  test('should return true if CheckAccountByEmailRepository returns false', async () => {
    const { sut } = makeSut();

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(true);
  });

  test('should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    checkAccountByEmailRepositorySpy.result = true;

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(false);
  });

  test('should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();

    await sut.add(mockAddAccountParams());

    expect(checkAccountByEmailRepositorySpy.email).toBe('any_email@mail.com');
  });

  test('should return true on success', async () => {
    const { sut } = makeSut();

    const isValid = await sut.add(mockAddAccountParams());

    expect(isValid).toBe(true);
  });
});
