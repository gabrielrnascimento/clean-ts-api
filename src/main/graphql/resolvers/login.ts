import { adaptResolver } from '@/main/adapters';
import { makeLoginController, makeSignUpController } from '@/main/factories/controllers';

export default {
  Query: {
    login: async (parent: any, args: any): Promise<any> => {
      return await adaptResolver(makeLoginController(), args);
    }
  },

  Mutation: {
    signup: async (parent: any, args: any): Promise<any> => {
      return await adaptResolver(makeSignUpController(), args);
    }
  }
};
