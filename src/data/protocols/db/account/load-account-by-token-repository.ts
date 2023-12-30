import { type AccountModel } from '@/domain/models';

export interface LoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<AccountModel>
}
