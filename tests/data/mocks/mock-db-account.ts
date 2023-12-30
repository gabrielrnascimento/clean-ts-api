import { type LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { mockAccountModel } from '../../domain/mocks';
import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { type AccountModel } from '@/domain/models/account';

export class AddAccountRepositorySpy implements AddAccountRepository {
  public addAccountParams: AddAccountRepository.Params;
  public result: AccountModel = mockAccountModel();

  async add (addAccountParams: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
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
