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

### POST - Cadastro (/signUp)

#### Dados enviados
- name
- email
- password

### **Exemplo de requisição**

```javascript
// POST/signUp
{
    "name": "José",
    "email": "jose@email.com",
    "password": "12345senha"

}
```

#### Dados retornados
- Sucesso 

```javascript

// POST/signUp
{   
 "message": "usuário cadastrado com sucesso"
}

HTTP Status 201
```
    
- Erro

```javascript

// POST/signUp
{
"error": "name é um campo obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "email já cadastrado"
}

HTTP Status 400

-------------------------------
    
{
"error": "password precisa ter no minímo 8 caracteres"
}

HTTP Status 400

```

#### Objetivos gerais
- Verificar se o email já existe
- Verificar se a senha possui no minímo 8 caracteres 

---

### POST - Login (/login)

#### Dados enviados
- email
- password

### **Exemplo de requisição**

```javascript
// POST/login
{
    "email": "jose@email.com",
    "password": "12345senha"
}
```

#### Dados retornados
- token

- Sucesso 

```javascript

// POST/login
{   
 "user": {
		"id": 14,
		"name": "João Silva",
		"email": "silva.joaoe@email.email"
	},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTY1NDU1MDE0NywiZXhwIjoxNjU0NTU3MzQ3fQ.fg2A9QzDf-uziNtKUHvVvuudYsDZyXo5IqQV-VXDmNE",
  "message": "login realizado com sucesso"
}

HTTP Status 200
```
    
- Erro

```javascript

// POST/login
{
"error": "email ou password estão incorretos"
}

HTTP Status 400

-------------------------------

{
"error": "usuário não encontrado"
}

HTTP Status 404

-------------------------------
    
{
"error": "password precisa ter no minímo 8 caracteres"
}

HTTP Status 400

```

#### Objetivos gerais
- Verificar se o usuário existe
- Verificar a senha

---

### PATCH - Editar perfil do usuário (/updateUser)

#### Dados enviados
- token
- name
- email
- cpf
- phone
- new_password

**Exemplo de requisição**

```javascript

// PATCH/updateUser
{
   "cpf": 87548269312,
   "phone": 62758946987
}

```

#### Dados retornados

- Sucesso 

```javascript

// PATCH/updateUser
{   
 "message": "cadastro alterado com sucesso"
}

HTTP Status 200
```
    
- Erro

```javascript

// PATCH/updateUser
{
"error": "é necessário infomar no minímo um campo para a atualização do usuário"
}

HTTP Status 400

-------------------------------

{
"error": "email já cadastrado"
}

HTTP Status 400

-------------------------------
    
{
"error": "password precisa ter no minímo 8 caracteres"
}

HTTP Status 400

-------------------------------
    
{
"error": "o campo cpf não pode ser alterado"
}

HTTP Status 400

```

#### Objetivos gerais
- Verificar se o token é válido
- É obrigatório informar no minímo um campo para atualização do cadastro
- Verificar se o email já está cadastrado
- Para cadastrar o cpf é necessário tem 11 números
- Para cadastrar o phone é necessário tem 11 números
- Verificar se o new_password tem no minímo 8 caracteres
- Não pode alterar um cpf se o usuário já tiver cadastrado anteriormente

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
- token

#### Dados retornados

- Sucesso 

```javascript

// GET/customers
{
"data":
        {
          "name": "Sara Lage Silva",
          "cpf": 05436525587,   
          "email": "sarasilva@gmail.com",
          "phone": 71994628654,
          "status": "Inadimplente"
        },
        {
          "name": "Cameron Freitas",
          "cpf": 83136525521,   
          "email": "cameronfreitas@gmail.com",
          "phone": 78912645654,
          "status": "Em dia"
        }   
}

HTTP Status 200

-------------------------------

{
 "message": "Não há clientes cadastrados"        
}

HTTP Status 200


```
    
- Erro

```javascript

// GET/customers
{
"error": "token obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "token inválido"
}

HTTP Status 400
    
```
#### Objetivos gerais
- Verificar o token
- Se houver clientes retornar eles (offset 10)
- Não tendo clientes retornar
    {
     "message": "Não há clientes cadastrados"
    }

---

### POST - Cadastro clientes (/registerCustomer)

#### Dados enviados
- token
- name
- email
- cpf
- phone
- address
- complement
- cep
- district
- city
- uf

**Exemplo de requisição**

```javascript

// POST/registerCustomer
{
    "name": "Tadeu Silveira",
    "email": "tadeusilveira@gmail.com",
    "cpf": 78945612378,
    "phone": 11993184567,
    "city": "Santo André",
    "uf": "SP"
}

```

#### Dados retornados
- Sucesso 

```javascript

// POST/registerCustomer
{
"message": "cliente cadastrado com sucesso"
}

HTTP Status 200
```
    
- Erro

```javascript

// POST/registerCustomer
{
"error": "o campo nome é obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "email já cadastrado"
}

HTTP Status 400

-------------------------------

{
"error": "cpf já cadastrado"
}

HTTP Status 400

```

#### Objetivos gerais
- Verificar o token
- Cadastrar o cliente se os dados obrigatórios forem informados
    - name
    - email (unique)
    - cpf (unique)
    - phone
    - city
    - uf

---

### GET - Detalhamento do cliente (/customerDetail)

#### Dados enviados
- token
- id_customer

**Exemplo de requisição**

```javascript

// GET/customerDetail
{
"id_customer": 12
}

```


#### Dados retornados
- Sucesso 

```javascript

// GET/customerDetail
{
"data":
    "name": "Sara Lage Silva",
    "email": "sarasilva@gmail.com",
    "address": "Rua das Cornélias",
    "phone": 71994628654,
    "district": "Oliveiras",
    "cpf": 05436525587,
    "complement": "Ap: 502",
    "cep": 40015970,
    "city": "Salvador",
    "uf": "BA"
}

HTTP Status 200
```
    
- Erro

```javascript

// GET/customerDetail
{
"error": "id_customer obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "cliente não encontrado"
}

HTTP Status 404
```

#### Objetivos gerais
- Verificar o token
- Encontrar o cliente pelo id_customer
- Retornar os dados do cliente
    - name
    - email
    - address
    - phone
    - district
    - cpf
    - complement
    - cep
    - city
    - uf

---

### PATH - Atualização do cliente(/customerUpdate)

#### Dados enviados

- token
- id_customer
- name
- email
- phone
- address
- complement
- cep
- district
- city
- uf

**Exemplo de requisição**

```javascript

// PATH/customerUpdate
{
    "id_customer": 12,
    "email": "novoEmail@gmail.com",
    "phone": 011998756431
}

```


#### Dados retornados
- Sucesso 

```javascript

// PATH/customerUpdate
{
"message": "edição do cadastro concluído com sucesso"
}

HTTP Status 200
```
    
- Erro

```javascript

// PATH/customerUpdate
{
"error": "id_customer obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "cliente não encontrado"
}

HTTP Status 404

-------------------------------

{
"error": "é necessário informar ao menos um campo além do id_customer para realizar a atualização do cliente "
}

HTTP Status 400

-------------------------------
    
{
"error": "email já cadastrado "
}

HTTP Status 400

-------------------------------
    
{
"error": "o campo phone deve ser preenchido"
}

HTTP Status 400

-------------------------------
    
{
"error": "o campo phone deve ter 11 caracteres"
}

HTTP Status 400

-------------------------------
```

#### Objetivos gerais
- Verificar o token
- Encontrar o cliente pelo id_customer
- Não é possível atualizar o cpf
- Verificar se ele informou pelo menos um campo além do id_customer
- Não permitir cadastrar um email já existente
- Não permitir atualizar os campos obrigatórios com espaço vazio
- Atualizar os dados do cliente que forem informados
    - name
    - email
    - address
    - phone
    - district
    - complement
    - cep
    - city
    - uf

---

### POST - Cadastro de cobranças (/billingRegister)

#### Dados enviados
- **token**
- **id_customer**
- **description**
- **due_date**
    - formato da data 'yyyy-MM-dd'
- **value**
    - valor informado em centavos
- **paid**
    - booleano true/false

**Exemplo de requisição**

```javascript

// GET/customerDetail
{
   "id_customer": 12,
   "description": "conta de água condomínio",
   "due_date": "2022-06-22",        
    "value": 450000,       
    "paid": false
}

```

#### Dados retornados
- Sucesso 

```javascript

// POST/billingRegister
{   
 "message": "cobrança cadastrada com sucesso"
}

HTTP Status 201
```
    
- Erro

```javascript

// GET/customerDetail
{
"error": "id_customer obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "cliente não encontrado"
}

HTTP Status 404

-------------------------------
    
{
"error": "description é um campo obrigatório"
}

HTTP Status 400

-------------------------------
    
{
"error": "due_date é um campo obrigatório"
}

HTTP Status 400

-------------------------------
    
{
"error": "value é um campo obrigatório"
}

HTTP Status 400

-------------------------------
    
{
"error": "paid é um campo obrigatório"
}

HTTP Status 400

```

#### Objetivos gerais
- Verificar o token
- Verificar o id_customer
- Cadastrar a cobrança do cliente
  
---


### GET - Listagem de cobranças (/billingList)

#### Dados enviados
- token

#### Dados retornados
- Sucesso 

```javascript

// GET/billingList
{
"data":
    {
        "name": "Ana Carolina",
        "id_charge": 50125,
        "value": 21000,    
        "due_date": "2022-07-20",       
        "status": "pendente",
        "description": "conta de internet"
    },
    {
       "name": "Pedro Teixeira",
        "id_charge": 48523,
        "value": 35000,    
        "due_date": "2022-05-12",       
        "status": "vencida",
        "description": "condomínio"
    }
    
}

HTTP Status 200

{
    "message": "Não há cobranças cadastradas"
}

HTTP Status 200
```   
    
- Erro

```javascript

// GET/billingList
{
"error": "token obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "token inválido"
}

HTTP Status 400
```

#### Objetivos gerais
- Verificar o token
- Se houver cobranças retonar elas (offset 9)
- Não tendo cobranças retorne
         {
    "message": "Não há cobranças cadastradas"
        }
    
---

### GET - Listagem de cobranças do cliente(/customerBillingList)

#### Dados enviados
- token
- id_customer

**Exemplo de requisição**

```javascript

// GET/customerBillingList
{
"id_customer": 12
}

```


#### Dados retornados
- Sucesso 

```javascript

// GET/customerBillingList
{
"data":
    {
        "id_charge": 50125,
        "due_date": "2022-07-20",
        "value": 21000,
        "status": "pendente",
        "description": "Conta de internet"
    },
    {
       "id_charge": 50789,      
       "due_date": "2022-05-22",        
       "value": 450000 ,       
       "status": "vencida",
       "description": "conta de água condomínio"
    }
    
}

HTTP Status 200

// GET/customerBillingList
{
    "message": "O cliente não possui cobranças"
}

HTTP Status 200
```   
    
- Erro

```javascript

// GET/customerBillingList
{
"error": "id_customer obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "cliente não encontrado"
}

HTTP Status 404
```

#### Objetivos gerais
- Verificar o token
- Verificar o id_customer
- Se houver cobranças retonar elas (offset 3)
- Não tendo cobranças retorne
         {
    "message": "O cliente não possui cobranças"
        }
    
---

### GET - Listagem de cobranças (/billingList)

#### Dados enviados
- token


#### Dados retornados
- Sucesso 

```javascript

// GET/billingList
{
"data":
    	{
			"name": "José oreia seca",
			"id_charge": 4,
			"value": 150000,
			"due_date": "2022-11-22",
			"description": "Ums conclusão de curso cara",
			"status": "Paga"
		},
		{
			"name": "José oreia seca",
			"id_charge": 3,
			"value": 15000000,
			"due_date": "2022-11-22",
			"description": "Ums conclusão de curso cara",
			"status": "Paga"
		},
		{
			"name": "Avelino Costa",
			"id_charge": 8,
			"value": 25000,
			"due_date": "2022-06-01",
			"description": "Mercado do mês",
			"status": "Vencida"
		}
    
}

HTTP Status 200

{
    []
}

HTTP Status 200
```   
    
- Erro

```javascript

// GET/billingList
{
"error": error.message
}

HTTP Status 400


```

#### Objetivos gerais
- Verificar o token
- Se houver cobranças retonar elas
- Não tendo cobranças retorne array vazio
         
---

### DELETE - Exclusão de cobrança(/deleteCharge/:id_charge)

#### Dados enviados
- token
- id_customer
- id_charge

**Exemplo de requisição**

```javascript

// DELETE/deleteCharge/:id_charge
{
"id_customer": 12
}

```


#### Dados retornados
- Sucesso 

```javascript

// DELETE/deleteCharge/:id_charge
{
	"message": "cobrança excluída com sucesso"
}

HTTP Status 200
```   
    
- Erro

```javascript

// DELETE/deleteCharge/:id_charge
{
"error": "id_customer obrigatório"
}

HTTP Status 400

-------------------------------

{
"error": "cobrança não encontrada"
}

HTTP Status 404

-------------------------------

{
"error": "cliente não encontrado"
}

HTTP Status 404

-------------------------------

{
"error": "a cobrança não pode ser deletada ou por estar vencida ou por estar paga"
}

HTTP Status 400

-------------------------------

{
"error": "a cobrança não pode ser excluída"
}

HTTP Status 400
```

#### Objetivos gerais
- Verificar o token
- Verificar o id_customer
- Verificar o id_charge
- Verificar se a cobrança pertence ao cliente
- Excluir a cobrança
    
---

### GET - Detalhe da cobrança(/billingDetails/:id_charge)

#### Dados enviados
- token
- id_charge

#### Dados retornados
- Sucesso 

```javascript

// GET/billingDetails/:id_charge
{
	"data": {
		"name": "José Gomes",
		"description": null,
		"due_date": "28-05-2022",
		"value": 81000,
		"id_charge": 6,
		"status": "Paga"
	}
}

HTTP Status 200
```   
    
- Erro

```javascript

// GET/billingDetails/:id_charge

{
"error": "cobrança não encontrada"
}

HTTP Status 404
```

#### Objetivos gerais
- Verificar o token
- Verificar o id_charge
- Retornar os detalhes da cobrança
    
---