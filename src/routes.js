const express = require("express");
const {
  registerUser,
  informationToTheUserHimself,
  updateUser,
} = require("./controllers/users");
const login = require("./controllers/login");
const {
  registerCustomer,
  delinquentCustomerHighligths,
  allDelinquentCustomers,
  highlightsCustomersUpToDate,
  customers,
  customerDetail,
  customerUpdate,
} = require("./controllers/customers");
const {
  chargesPaid,
  overdueCharges,
  anticipatedCharges,
  highlightsOverdueCollections,
  allOverdueCharges,
  highlightsExpectedCharges,
  allAnticipatedCharges,
  highlightsPaidCharges,
  allChargesPaid,
  billingRegister,
  billingList,
  billingEdit,
  deleteCharge,
  billingDetails,
} = require("./controllers/charges");

const checkLogin = require("./middlewares/checkLogin");

const routes = express();

//? Rotas para login
routes.post("/signup", registerUser);
routes.post("/login", login);

routes.use(checkLogin);

//? Rotas para informação de usuário
routes.patch("/updateUser", updateUser);
routes.get("/informationToTheUserHimself", informationToTheUserHimself);

//? Rotas para Contas.
routes.get("/chargesPaid", chargesPaid);
routes.get("/overdueCharges", overdueCharges);
routes.get("/anticipatedCharges", anticipatedCharges);

routes.get("/highlightsOverdueCollections", highlightsOverdueCollections);
routes.get("/allOverdueCharges", allOverdueCharges);
routes.get("/highlightsExpectedCharges", highlightsExpectedCharges);
routes.get("/allAnticipatedCharges", allAnticipatedCharges);
routes.get("/highlightsPaidCharges", highlightsPaidCharges);
routes.get("/allChargesPaid", allChargesPaid);

//? Rotas para Clientes.
routes.post("/registerCustomer", registerCustomer);
routes.get("/delinquentCustomerHighligths", delinquentCustomerHighligths);
routes.get("/allDelinquentCustomers", allDelinquentCustomers);
routes.get("/highlightsCustomersUpToDate", highlightsCustomersUpToDate);
routes.get("/customers", customers);
routes.get("/customerDetail/:id_customer", customerDetail);
routes.patch("/customerUpdate/:id_customer", customerUpdate);

routes.post("/billingRegister/:client_id", billingRegister);
routes.get("/billingList", billingList);
routes.patch("/billingEdit/:id_charge", billingEdit);
routes.delete("/deleteCharge/:id_charge", deleteCharge);
routes.get("/billingDetails/:id_charge", billingDetails);

module.exports = routes;
