const express = require('express');
const { registerUser,
    informationToTheUserHimself,
    updateUser,
    deleteUser } = require('./controllers/users');
const login = require('./controllers/login');
const { registerCustomer,
    delinquentCustomerHighligths,
    highlightsCustomersUpToDate,
    customers } = require('./controllers/customers');
const { chargesPaid,
    overdueCharges,
    anticipatedCharges,
    highlightsOverdueCollections,
    highlightsExpectedCharges,
    highlightsPaidCharges } = require('./controllers/charges');

const checkLogin = require('./middlewares/tokenNeeded');

const routes = express();

routes.post('/signup', registerUser);
routes.post('/login', login);
routes.use(checkLogin);

routes.patch('/updateUser', updateUser);
routes.get('/informationToTheUserHimself', informationToTheUserHimself)

routes.post('/registerCustomer', registerCustomer);

routes.get('/chargesPaid', chargesPaid);
routes.get('/overdueCharges', overdueCharges);
routes.get('/anticipatedCharges', anticipatedCharges);

routes.get('/highlightsOverdueCollections', highlightsOverdueCollections);
routes.get('/highlightsExpectedCharges', highlightsExpectedCharges);
routes.get('/highlightsPaidCharges', highlightsPaidCharges);

routes.get('/delinquentCustomerHighligths', delinquentCustomerHighligths);
routes.get('/highlightsCustomersUpToDate', highlightsCustomersUpToDate);
routes.get('/customers', customers);


module.exports = routes;
