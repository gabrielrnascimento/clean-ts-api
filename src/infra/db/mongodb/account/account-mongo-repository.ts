import { type ObjectId } from 'mongodb';
import { type AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { type AccountModel } from '../../../../domain/models/account';
import { type AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { type LoadAccountByEmailRepository } from '../../../../data/usecases/authentication/db-authentication-protocols';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.insertOne(accountData);
    return MongoHelper.map(accountData);
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    return account && MongoHelper.map(account);
  }

  async updateAccessToken (id: ObjectId, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: { accessToken: token }
    });
  }
}
