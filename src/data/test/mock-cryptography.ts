import { type Decrypter } from '@/data/protocols/cryptography/decrypter';
import { type Encrypter } from '@/data/protocols/cryptography/encrypter';
import { type HashComparer } from '@/data/protocols/cryptography/hash-comparer';
import { type Hasher } from '@/data/protocols/cryptography/hasher';

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password'); });
    }
  }
  return new HasherStub(); ;
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_value'); });
    }
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'any_token';
    }
  }
  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true;
    }
  }
  return new HashComparerStub();
};
