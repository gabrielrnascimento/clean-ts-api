import { type Decrypter, type Encrypter, type HashComparer, type Hasher } from '@/data/protocols/cryptography';
import { faker } from '@faker-js/faker';

export class HasherSpy implements Hasher {
  public value: string;
  public result: string = faker.string.uuid();

  async hash (value: string): Promise<string> {
    this.value = value;
    return this.result;
  }
}

export class DecrypterSpy implements Decrypter {
  public value: string;
  public result: string = faker.string.alphanumeric();

  async decrypt (value: string): Promise<string> {
    this.value = value;
    return this.result;
  }
}

export class EncrypterSpy implements Encrypter {
  public value: string;
  public result: string = faker.string.uuid();

  async encrypt (value: string): Promise<string> {
    this.value = value;
    return this.result;
  }
}

export class HashComparerSpy implements HashComparer {
  public value: string;
  public hash: string;
  public result: boolean = true;

  async compare (value: string, hash: string): Promise<boolean> {
    this.value = value;
    this.hash = hash;
    return this.result;
  }
}
