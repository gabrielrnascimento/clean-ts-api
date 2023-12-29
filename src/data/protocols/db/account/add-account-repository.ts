import { type AddAccountParams } from '@/domain/usecases';
import { type AccountModel } from '@/domain/models/account';

export interface AddAccountRepository {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
