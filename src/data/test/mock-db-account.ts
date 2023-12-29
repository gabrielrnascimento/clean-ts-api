import { mockAccountModel } from '@/domain/test';
import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { type LoadAccountByEmailRepository, type AccountModel, type AddAccountParams } from '@/data/usecases/account/add-account/db-add-account-protocols';
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';

export class AddAccountRepositorySpy implements AddAccountRepository {
  public addAccountParams: AddAccountParams;
  public result: AccountModel = mockAccountModel();

  async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = addAccountParams;
    return this.result;
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  public email: string;
  public result: AccountModel = mockAccountModel();

  async loadByEmail (email: string): Promise<AccountModel> {
    this.email = email;
    return this.result;
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  public token: string;
  public role: string;
  public result: AccountModel = mockAccountModel();

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    this.token = token;
    this.role = role;
    return this.result;
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  public accountId: string;
  public token: string;

  async updateAccessToken (accountId: string, token: string): Promise<void> {
    this.accountId = accountId;
    this.token = token;
    return null;
  }
}
