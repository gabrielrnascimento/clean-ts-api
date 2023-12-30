import { type AccountModel } from '../models';

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<AccountModel>
}
