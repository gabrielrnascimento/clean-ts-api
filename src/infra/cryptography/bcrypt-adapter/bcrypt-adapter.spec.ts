import { throwError } from '@/domain/test';
import { BcryptAdapter } from './bcrypt-adapter';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value');
  },

  async compare (): Promise<boolean> {
    return await Promise.resolve(true);
  }
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('BcryptAdapter', () => {
  describe('hash()', () => {
    test('should call hash with correct values', async () => {
      const salt = 12;
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('should return a valid hash on hash success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');
      expect(hash).toBe('hashed_value');
    });

    test('should throw if bcrypt hash throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);
      const hash = sut.hash('any_value');
      await expect(hash).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    test('should call compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'any_hash');
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    test('should return true when compare succeeds', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash');
      expect(isValid).toBe(true);
    });

    test('should return false when compare fails', async () => {
      const sut = makeSut();
      jest.spyOn<typeof bcrypt, any>(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false));
      const isValid = await sut.compare('any_value', 'any_hash');
      expect(isValid).toBe(false);
    });

    test('should throw if bcrypt compare throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError);
      const promise = sut.compare('any_value', 'any_hash');
      await expect(promise).rejects.toThrow();
    });
  });
});
