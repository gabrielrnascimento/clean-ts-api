export const serverErrorComponent = {
  description: 'Problema no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
};
