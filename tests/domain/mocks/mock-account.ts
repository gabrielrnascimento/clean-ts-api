import { type AccountModel } from '@/domain/models/account';
import { type AddAccount } from '@/domain/usecases/add-account';
import { type Authentication, type AuthenticationParams } from '@/domain/usecases/authentication';
import { type LoadAccountByToken } from '@/domain/usecases/load-account-by-token';
import { type AuthenticationModel } from '@/domain/models/authentication';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAccountModel = (): AccountModel => Object.assign(
  {},
  mockAddAccountParams(),
  { id: 'any_id' }
);

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: 'any_token',
  name: 'any_name'
});

export class AddAccountSpy implements AddAccount {
  public addAccountParams: AddAccount.Params;
  public result: AddAccount.Result = true;

  async add (addAccountParams: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = addAccountParams;
    return this.result;
  }
}

export class AuthenticationSpy implements Authentication {
  public authenticationParams: AuthenticationParams;
  public result: AuthenticationModel = mockAuthenticationModel();

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authenticationParams;
    return this.result;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  public accessToken: string;
  public role: string;
  public result: AccountModel = mockAccountModel();

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken;
    this.role = role;
    return this.result;
  }
}
