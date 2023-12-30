import { AccountMongoRepository, MongoHelper } from '@/infra/db/mongodb';
import { mockAddAccountParams } from '../../../domain/mocks';
import { type Collection } from 'mongodb';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

let accountCollection: Collection;

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('add()', () => {
    test('should return true on add success', async () => {
      const sut = makeSut();
      const isValid = await sut.add(mockAddAccountParams());
      expect(isValid).toBe(true);
    });
  });

  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success', async () => {
      await accountCollection.insertOne(mockAddAccountParams());
      const sut = makeSut();

      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.password).toBe('any_password');
    });

    test('should return null if loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const res = await accountCollection.insertOne(mockAddAccountParams());

      const id = res.insertedId;
      const previous = await accountCollection.findOne({ _id: id });

      expect(previous.accessToken).toBeFalsy();

      await sut.updateAccessToken(id, 'any_token');

      const account = await accountCollection.findOne({ _id: id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken()', () => {
    test('should return an account id on loadByToken without role', async () => {
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token'
      });
      const sut = makeSut();

      const account = await sut.loadByToken('any_token');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('should return an account id on loadByToken with admin role', async () => {
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token',
        role: 'admin'
      });
      const sut = makeSut();

      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('should return null on loadByToken with invalid role', async () => {
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token'
      });
      const sut = makeSut();

      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeFalsy();
    });

    test('should return an account id on loadByToken if user is admin', async () => {
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token',
        role: 'admin'
      });
      const sut = makeSut();

      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any_token');
      expect(account).toBeFalsy();
    });
  });
});
