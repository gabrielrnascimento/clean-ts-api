import { adaptResolver } from '@/main/adapters';
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers';

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any): Promise<any> => {
      return await adaptResolver(makeLoadSurveyResultController(), args, context);
    }
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any): Promise<any> => {
      return await adaptResolver(makeSaveSurveyResultController(), args, context);
    }
  }
};
