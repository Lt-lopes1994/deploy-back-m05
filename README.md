# cobreBem

## Coisas que poderão ser feitas
- Fazer cadastro
- Fazer login
- Header
    - Editar perfil
- Home 
    - Acesso ao resumo das cobranças
    - Visualizar cobranças pagas
    - Visualizar cobranças vencidas
    - Visualizar cobranças previstas
    - Visualizar os clientes inadimplentes
    - Visualizar os clientes em dia
- Clientes
    - Adicionar cliente
    - Pesquisar cliente
    - Acesso a lista de clientes

---

## Coisas que não poderão ser feitas
- Excluir cliente

___

### POST - Cadastro (/signup)

#### Dados enviados
- Nome
- Email
- Senha
- Confirmação de senha

#### Dados retornados
- Sucesso ou erro

#### Objetivos gerais
- Verificar se o email já existe
- Verificar se a senha possui no minímo 8 caracteres 
- Verificar se a senha e a confirmação de senha coincidem

### **Exemplo de requisição**

```javascript
// POST /signup
{
    "name": "José",
    "email": "jose@email.com",
    "password": "12345senha"

}
```
---

### POST - Login (/login)

#### Dados enviados
- Email
- Senha

#### Dados retornados
- Token
- Sucesso ou erro

#### Objetivos gerais
- Verificar se o usuário existe
- Verificar a senha

### **Exemplo de requisição**
```javascript
// POST /login
{
    "email": "jose@email.com",
    "password": "12345senha"
}
```
---

### PATCH - Editar perfil do usuário (/updateUser)

#### Dados enviados
- Token
- Nome
- Email
- CPF
- Telefone
- Nova senha
- Confirmar senha

#### Dados retornados
- Sucesso ou erro

#### Objetivos gerais
- Verificar se o token é válido
- São obrigatórios
    - Nome
    - Email
    - Nova Senha
    - Confirmar Senha
- Verificar se o email já está cadastrado
- Verificar se a senha e a confirmação de senha coincidem

### **Exemplo de requisição**
```javascript
// PATCH /updateUser
{
    "name": "José",
    "email": "jose@email.com",
    "cpf": "12345678910",
    "password": "12345senha",
    "address": "ST. D Norte QND 47, Brasília, DF, 70297-400",
}
```
---

### GET - Cobranças pagas (/chargesPaid)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro

#### Objetivos gerais
- Verificar se o token é válido
- Retornar o valor total de todas as cobranças pagas

---

### GET - Cobranças vencidas (/overdueCharges)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro

#### Objetivos gerais
- Verificar se o token é válido
- Retornar o valor total de todas as cobranças vencidas

---

### GET - Cobranças previstas (/anticipatedCharges)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro

#### Objetivos gerais
- Retornar o valor total de todas as cobranças previstas

---

### GET - Destaques cobranças vencidas (/highlightsOverdueCollections)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro
- Nome do cliente
- Id da cobrança
- Valor

#### Objetivos gerais
- Verificar o token
- Retornar quatro cobranças vencidas

---

### GET - Destaques cobranças previstas (/highlightsExpectedCharges)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro
- Nome do cliente
- Id da cobrança
- Valor

#### Objetivos gerais
- Verificar o token
- Retornar quatro cobranças previstas

---

### GET - Destaques cobranças pagas (/highlightsPaidCharges)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro
- Nome do cliente
- Id da cobrança
- Valor

#### Objetivos gerais
- Verificar o token
- Retornar quatro cobranças pagas

---

### GET - Destaques clientes inadiplentes (/delinquentCustomerHighligths)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro
- Nome do cliente
- Data do vencimento
- Valor

#### Objetivos gerais
- Verificar o token
- Retornar quatro clientes inadimplentes

---

### GET - Destaques clientes em dia (/highlightsCustomersUpToDate)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro
- Nome do cliente
- Data do vencimento
- Valor

#### Objetivos gerais
- Verificar o token
- Retornar quatro clientes em dia

---

### GET - Clientes (/customers)

#### Dados enviados
- Token

#### Dados retornados
- Sucesso ou erro
- Nome do cliente
- CPF
- Email
- Telefone
- Status

#### Objetivos gerais
- Verificar o token
- Retornar todos os clientes

---

### POST - Cadastro clientes (/registerCustomer)

#### Dados enviados
- Token
- Nome
- Email
- CPF
- Telefone
- Endereço
- Complemento
- CEP
- Bairro
- Cidade
- UF

#### Dados retornados
- Sucesso ou erro

#### Objetivos gerais
- Verificar o token
- São obrigatórios
    - Nome
    - Email
    - CPF
    - Telefone
    - Cidade
    - UF

---

# deploy-back-m05
