import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup';
import { type Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
