import { type Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSignUpController } from '@/main/factories/controllers/signup-controller-factory';
import { makeLoginController } from '@/main/factories/controllers/login-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
