# Redirecionador de Url

Para iniciar: 
>npm start
Hospedado na porta: 3434

## Requisicoes

### Criar user

__POST__ 
>/create/user

body em JSON, enviar:
- username
- email

__Retorna a userId em JSON__

_Erros_:
- (404) username ja existente
- (400) problema nos dados de entrada

### Criar URL encurtada

__POST__
>/user/:userId

body em JSON:
- originalUrl(Url que vai ser encurtada)
- name(path/nome)
- limit(numero inteiro - limite de visitas)
- category
- timeLimit(tempo para expirar a Url em minutos - 0 para fazer uma Url que nao expira com o tempo)

__retorna o objeto Url em JSON__

- id
- originalUrl
- name(name/path)
- tinyUrl(Url encurtada)
- numberOfVisits
- limitOfVisits
- imageUrl
- userId
- category
- timeLimit


_Erros_:
- (406) Url invalida
- (404) path/name ja existente
- (400) problema nos dados de entrada

### Deletar Url

__DELETE__
>/delete/:userId/:urlName

:urlname -> nome/path da Url

_Erros_:
- (404) path/name nao encontrado
- (401) userId nao autorizada

### Listar Url

__GET__
>/user/:userId

lista todas Urls criadas pelo usuario

### Listar Url por categoria

__GET__
>/user/:userId/:category

lista todas as Urls criadas pelo usuario por categoria

### Link Encurtado

__GET__
>/:urlName

redireciona para a Url original