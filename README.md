# Redirecionador de Url

Para iniciar: >npm start
Hospedado na porta: 3434

## Requisicoes

### Criar user

__POST__ 
>/create/user

body em JSON, enviar:
- username
- email

__retorna a userId em JSON__

_Erros_:
-(404) username ja existente
-(400) problema nos dados de entrada

### Criar URL encurtada

__POST__
>/user/<userId>

body em JSON:
- originalUrl(Url que vai ser encurtada)
- name(path/nome)
-limit(numero inteiro - limite de visitas)
-category
-timeLimit(tempo para expirar a Url - 0 para fazer uma Url que nao expira com o tempo)
