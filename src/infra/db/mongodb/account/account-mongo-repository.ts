import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { type UpdateAccessTokenRepository, type LoadAccountByEmailRepository } from '@/data/usecases/account/authentication/db-authentication-protocols';
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { type AccountModel } from '@/domain/models/account';
import { type AddAccountParams } from '@/domain/usecases/account/add-account';
import { MongoHelper } from '@/infra/db/mongodb/helpers';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    return MongoHelper.map(accountData);
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }

  async updateAccessToken (id: any, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: { accessToken: token }
    });
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    });
    return account && MongoHelper.map(account);
  }
}
