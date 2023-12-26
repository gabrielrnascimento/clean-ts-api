# Resultado da enquete

> ## Caso de sucesso

1. ⛔️ Recebe uma requisição do tipo **GET** na rota **/api/surveys/{survey_id}/results**
2. ⛔️ Valida se a requisição foi feita por um **usuário**
3. ⛔️ Retorna **200** com os dados do resultado da enquete
4. ⛔️ Retorna **204** se não tiver nenhum resultado de enquete

> ## Exceções

1. ⛔️ Retorna erro **403** se não for um usuário
2. ⛔️ Retorna erro **404** se a API não existir
3. ⛔️ Retorna erro **403** se o survey_id passado na URL for inválido
4. ⛔️ Retorna erro **500** se der erro ao tentar carregar o resultado da enquete