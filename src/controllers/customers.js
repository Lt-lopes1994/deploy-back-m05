const knex = require('../scripts/conection');
const { format } = require('date-fns');
const registerCustomerSchema = require('../validations/registerCustomerSchema');
const customerUpdateSchema = require('../validations/customerUpdateSchema');
const errors = require('../scripts/error-messages');
const messages = require('../scripts/messages');

const registerCustomer = async (req, res) => {
  const {
    name,
    email,
    cpf,
    phone,
    address,
    cep,
    complement,
    district,
    city,
    uf,
  } = req.body;

  try {
    await registerCustomerSchema.validate(req.body);

    const registeredEmail = await knex('clients').where({ email }).first();

    if (registeredEmail) {
      return res.status(400).json(errors.userExists);
    }

    const registeredCPF = await knex('clients').where({ cpf }).first();

    if (registeredCPF) {
      return res.status(400).json(errors.cpfExists);
    }

    const customer = await knex('clients').insert(req.body);

    if (!customer) {
      return res.status(400).json(errors.unregisteredCustomer);
    }

    return res.status(200).json({ 'message': messages.clientRegisteredSuccessfully });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const currentMoment = () => new Date();

const delinquentCustomerHighligths = async (req, res) => {
  try {
    const sampleDelinquentCustomers = await knex
      .select('clients.name', 'due_date', 'value', 'clients.id')
      .from('charges')
      .leftJoin('clients', 'clients.id', 'charges.client_id')
      .where('paid', '=', false)
      .where('due_date', '<', currentMoment())
      .distinctOn('clients.id')
      .limit(4);

    if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const dueDateFormat = sampleDelinquentCustomers.map((delinquent) => {
      delinquent.due_date = format(delinquent.due_date, 'yyyy-MM-dd');
      return delinquent;
    });

    return res.status(200).json({ 'data': dueDateFormat });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const allDelinquentCustomers = async (req, res) => {
  try {
    const sampleDelinquentCustomers = await knex
      .select('clients.name', 'due_date', 'value', 'clients.id')
      .from('charges')
      .leftJoin('clients', 'clients.id', 'charges.client_id')
      .where('paid', '=', false)
      .where('due_date', '<', currentMoment())
      .distinctOn('clients.id');

    if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
      return res.status(400).json([]);
    }

    const dueDateFormat = sampleDelinquentCustomers.map((delinquent) => {
      delinquent.due_date = format(delinquent.due_date, 'yyyy-MM-dd');
      return delinquent;
    });

    return res.status(200).json({ 'data': dueDateFormat });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const highlightsCustomersUpToDate = async (req, res) => {
  try {
    const allCustomers = await knex('clients')
      .select('name', 'cpf', 'email', 'phone', 'clients.id')
      .orderBy('clients.id');

    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const dueDateFormat = allCustomers.map((customerUpToDate) => {
      customerUpToDate.due_date = format(customerUpToDate.due_date, 'yyyy-MM-dd');
      return customerUpToDate;
    });

    const filterCustomers = [];

    for (let customer of dueDateFormat) {
      const chargesCustomer = await knex('charges').where({
        client_id: customer.id,
      });

      customer.charges = [];
      for (let charge of chargesCustomer) {
        if (!charge.paid && charge.due_date < currentMoment()) {
          return;
        }
        if (!charge.paid && charge.due_date > currentMoment() || charge.paid) {
          if (customer.charges.length < 1) {
            customer.charges.push(charge);
          }
        }
      }

      if (customer.charges.length !== 0) {
        if (filterCustomers.length < 4) {
          filterCustomers.push(customer);
        }
      }
    }

    const customersUpToDate = {
      data: {
        customer: filterCustomers.name,
        charges: filterCustomers.charges
      },
    };

    return res.status(200).json(customersUpToDate);
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
}

const allCustomersUpToDate = async (req, res) => {
  const { offset } = req.query;

  const p = offset ? offset : 0;

  try {
    const allCustomers = await knex('clients')
      .select('name', 'cpf', 'email', 'phone', 'id')
      .offset(p)
      .orderBy('id');

    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const dueDateFormat = allCustomers.map((customerUpToDate) => {
      customerUpToDate.due_date = format(customerUpToDate.due_date, 'yyyy-MM-dd');
      return customerUpToDate;
    });

    const customersData = [];

    for (let customer of dueDateFormat) {
      const chargesCustomer = await knex('charges').where({
        client_id: customer.id,
      });

      const checkOverdueCharge = chargesCustomer.find(
        (charge) => !charge.paid && charge.due_date < currentMoment()
      );

      if (!checkOverdueCharge) {
        customer.status = 'Em dia';
        customersData.push(customer);
      }
    }

    return res.status(200).json({ 'data': customersData });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const customers = async (req, res) => {
  const { offset } = req.query;

  const p = offset ? offset : 0;

  try {
    const allCustomers = await knex('clients')
      .select('name', 'cpf', 'email', 'phone', 'id')
      .offset(p)
      .limit(10)
      .orderBy('id');

    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const customersData = [];

    for (let customer of allCustomers) {
      const chargesCustomer = await knex('charges').where({
        client_id: customer.id,
      });

      const checkOverdueCharge = chargesCustomer.find(
        (charge) => !charge.paid && charge.due_date < currentMoment()
      );

      if (checkOverdueCharge) {
        customer.status = 'Inadimplente';
      } else {
        customer.status = 'Em dia';
      }

      customersData.push(customer);
    }

    return res.status(200).json({ 'data': customersData });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const customerDetail = async (req, res) => {
  const { id_customer } = req.params;

  try {
    const customer = await knex
      .select(
        'name',
        'email',
        'address',
        'phone',
        'district',
        'cpf',
        'complement',
        'cep',
        'city',
        'uf'
      )
      .from('clients')
      .where('clients.id', '=', id_customer);

    if (!customer || customer.length === 0) {
      return res.status(200).json([]);
    }

    const customerCharges = await knex
      .select('charges.id', 'due_date', 'value', 'paid', 'description')
      .from('charges')
      .where('charges.client_id', '=', id_customer);

    if (!customerCharges || customerCharges.length === 0) {
      return res.status(200).json([]);
    }

    const checkBillingStatus = customerCharges.map((charge) => {
      if (charge.paid === false && charge.due_date < currentMoment()) {
        charge.status = 'Vencida';
      }
      if (charge.paid === false && charge.due_date > currentMoment()) {
        charge.status = 'Pendente';
      }
      if (charge.paid === true) {
        charge.status = 'Paga';
      }

      charge.due_date = format(charge.due_date, 'yyyy-MM-dd');
      delete charge.paid;

      return charge;
    });

    const detailing = {
      data: {
        customer,
        charges: checkBillingStatus,
      },
    };

    return res.status(200).json(detailing);
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

const customerUpdate = async (req, res) => {
  const { id_customer } = req.params;
  const { name, email, phone, address, complement, cep, district, city, uf } =
    req.body;

  if (
    !name &&
    !email &&
    !phone &&
    !address &&
    !complement &&
    !cep &&
    !district &&
    !city &&
    !uf
  ) {
    return res.status(400).json({
      'error':
        errors.itIsNecessaryToInformAtLeastOneFieldToUpdateTheClient
    });
  }

  try {
    await customerUpdateSchema.validate(req.body);

    const customerExists = await knex('clients')
      .where('clients.id', '=', id_customer)
      .first();

    if (!customerExists || customerExists.length === 0) {
      return res.status(404).json({ 'error': errors.thereIsNoSuchCustomer });
    }

    if (email) {
      const checkEmail = await knex('clients').where({ email }).first();

      if (checkEmail) {
        return res.status(400).json({ 'error': errors.userExists });
      }
    }

    const clientEdition = await knex('clients')
      .update(req.body)
      .where('clients.id', '=', id_customer);

    if (!clientEdition || clientEdition.length === 0) {
      return res
        .status(400)
        .json({ 'error': errors.unableToUpdateClient });
    }

    return res
      .status(200)
      .json({ 'message': messages.clientUpdateCompletedSuccessfully });
  } catch (error) {
    return res.status(400).json({ 'message': error.message });
  }
};

module.exports = {
  registerCustomer,
  delinquentCustomerHighligths,
  allDelinquentCustomers,
  highlightsCustomersUpToDate,
  allCustomersUpToDate,
  customers,
  customerDetail,
  customerUpdate,
};
