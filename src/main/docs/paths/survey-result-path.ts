export const surveyResultPath = {
  get: {
    security: [{
      apiKeyAuth: [] as string[]
    }],
    tags: ['Enquete'],
    summary: 'API para consultar o resultado de uma enquete',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'ID da enquete a ser consultada',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  put: {
    security: [{
      apiKeyAuth: [] as string[]
    }],
    tags: ['Enquete'],
    summary: 'API para criar resposta de uma enquete',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'ID da enquete a ser respondida',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
};
