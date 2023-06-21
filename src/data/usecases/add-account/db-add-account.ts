import { type AccountModel, type AddAccount, type AddAccountModel, type Encrypter } from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) { }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return await new Promise(resolve => {
      resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      });
    });
  }
}
