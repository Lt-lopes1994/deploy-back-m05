const express = require('express');
const { registerUser,
    informationToTheUserHimself,
    updateUser } = require('./controllers/users');
const login = require('./controllers/login');
const { registerCustomer,
    delinquentCustomerHighligths,
    allDelinquentCustomers,
    highlightsCustomersUpToDate,
    allCustomersUpToDate,
    customers,
    customerDetail,
    customerUpdate } = require('./controllers/customers');
const { chargesPaid,
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
    billingDetails } = require('./controllers/charges');

const checkLogin = require('./middlewares/tokenNeeded');

const routes = express();

routes.post('/signup', registerUser);
routes.post('/login', login);

routes.use(checkLogin);

routes.get('/user', informationToTheUserHimself)
routes.patch('/user/updateUser', updateUser);

routes.get('/chargesPaid', chargesPaid);
routes.get('/overdueCharges', overdueCharges);
routes.get('/anticipatedCharges', anticipatedCharges);

routes.get('/highlightsOverdueCollections', highlightsOverdueCollections);
routes.get('/allOverdueCharges', allOverdueCharges);
routes.get('/highlightsExpectedCharges', highlightsExpectedCharges);
routes.get('/allAnticipatedCharges', allAnticipatedCharges);
routes.get('/highlightsPaidCharges', highlightsPaidCharges);
routes.get('/allChargesPaid', allChargesPaid);

routes.post('/registerCustomer', registerCustomer);
routes.get('/delinquentCustomerHighligths', delinquentCustomerHighligths);
routes.get('/allDelinquentCustomers', allDelinquentCustomers);
routes.get('/highlightsCustomersUpToDate', highlightsCustomersUpToDate);
routes.get('/allCustomersUpToDate', allCustomersUpToDate);
routes.get('/customers', customers);
routes.get('/customerDetail/:id_customer', customerDetail);
routes.patch('/customerUpdate/:id_customer', customerUpdate);

routes.post('/billingRegister/:client_id', billingRegister);
routes.get('/billingList', billingList);
routes.patch('/billingEdit/:id_charge', billingEdit);
routes.delete('/deleteCharge/:id_charge', deleteCharge);
routes.get('/billingDetails/:id_charge', billingDetails);

module.exports = routes;
