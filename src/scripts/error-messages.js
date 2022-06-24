const errors = {
  enterClientIdParams: "informe o client_id no params",
  thereIsNoSuchCustomer: "não existe esse cliente",
  thereIsNoSuchUser: "não existe esse usuário",
  unableToRegisterTheCharge: "não foi possível cadastrar a cobrança",
  itIsNecessaryToInformAtLeastOneFieldToUpdateTheBilling:
    "é necessário informar ao menos um campo para fazer a atualização da cobrança",
  unableToUpdateBilling: "não foi possível atualizar a cobrança",
  itIsNecessaryToInformTheIdCustomer: "é necessário informar o id_customer",
  chargeNotFound: "cobrança não encontrada",
  theChargeCannotBeDeletedEitherBecauseItIsOverdueOrPaid:
    "a cobrança não pode ser deletada ou por estar vencida ou por estar paga",
  theChargeCannotBeDeleted: "a cobrança não pode ser excluída",
  userExists: "já existe um usuário cadastrado com o e-mail informado",
  cpfExists: "CPF já cadastrado",
  unregisteredCustomer: "não foi possivel cadastrar o cliente",
  itIsNecessaryToInformAtLeastOneFieldToUpdateTheClient:
    "é necessário informar ao menos um campo para fazer a atualização do cliente",
  unableToUpdateClient: "não foi possível atualizar o cliente",
  userNotFound: "usuário não encontrado",
  loginIncorrect: "email ou senha incorretos",
  couldNotSignin: "não foi possivel cadastrar o usuário",
  userUpdate: "Não foi possível atualizar o usuário",
  userDelete: "Não foi possível deletar o usuário.",
  userHasExchangeAndShopping:
    "Exclua suas trocas e compras para poder deletar sua conta.",
  noReturnTotalAmountChargesPaid:
    "Não foi possível ter acesso ao valor total das cobranças pagas",
  noReturnTotalAmountOverdueCharges:
    "Não foi possível ter acesso ao valor total das cobranças vencidas",
  noReturnTotalAmountExpectedCharges:
    "Não foi possível ter acesso ao valor total das cobranças previstas",
  noReturnOverdueCharges:
    "Não foi possível ter acesso aos destaques das cobranças vencidas",
  noReturnAnticipatedCharges:
    "Não foi possível ter acesso aos destaques das cobranças previstas",
  noReturnBillsPaid:
    "Não foi possível ter acesso aos destaques das cobranças pagas",
  noReturnFromDefaultingCustomers:
    "Não foi possível ter acesso aos destaques dos clientes inadimplentes",
  noDelinquentCustomers: "Não há clientes inadimplentes",
  noReturnFromRegularizedCustomers:
    "Não foi possível ter acesso aos destaques dos clientes em dia",
  noRegularizedCustomers: "Não há clientes em dia",
  thereAreNoChargesPaid: "Não há cobranças pagas",
  thereAreNoOverdueCharges: "Não há cobranças atrasadas",
  thereAreNoAnticipatedCharges: "Não há cobranças previstas",
  notAuthorized: "não autorizado",
  invalidToken: "token inválido",
};

module.exports = errors;
