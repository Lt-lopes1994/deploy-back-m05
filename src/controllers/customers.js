const knex = require("../scripts/conection");
const { format } = require("date-fns");
const registerCustomerSchema = require("../validations/registerCustomerSchema");
const customerUpdateSchema = require("../validations/customerUpdateSchema");
const errors = require("../scripts/error-messages");
const messages = require("../scripts/messages");

const registerCustomer = async (req, res) => {
  const {
    name,
    email,
    cpf,
    phone,
    adress,
    cep,
    complement,
    district,
    city,
    uf,
  } = req.body;

  try {
    await registerCustomerSchema.validate(req.body);

    const registeredEmail = await knex("clients").where({ email }).first();

    if (registeredEmail) {
      return res.status(400).json(errors.userExists);
    }

    const registeredCPF = await knex("clients").where({ cpf }).first();

    if (registeredCPF) {
      return res.status(400).json(errors.cpfExists);
    }

    const customer = await knex("clients").insert(req.body);

    if (!customer) {
      return res.status(400).json(errors.unregisteredCustomer);
    }

    return res
      .status(200)
      .json({ message: messages.clientRegisteredSuccessfully });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const currentMoment = () => new Date();

const delinquentCustomerHighligths = async (req, res) => {
  try {
    const sampleDelinquentCustomers = await knex
      .select("clients.name", "due_date", "value", "clients.id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment())
      .distinctOn("clients.id")
      .limit(4);

    if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const dueDateFormat = sampleDelinquentCustomers.map((delinquent) => {
      delinquent.due_date = format(delinquent.due_date, "yyyy-MM-dd");
      return delinquent;
    });

    return res.status(200).json({ data: dueDateFormat });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const allDelinquentCustomers = async (req, res) => {
  try {
    const sampleDelinquentCustomers = await knex
      .select("clients.name", "due_date", "value", "clients.id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment())
      .distinctOn("clients.id");

    if (!sampleDelinquentCustomers || sampleDelinquentCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const dueDateFormat = sampleDelinquentCustomers.map((delinquent) => {
      delinquent.due_date = format(delinquent.due_date, "yyyy-MM-dd");
      return delinquent;
    });

    return res.status(200).json({ data: dueDateFormat });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const highlightsCustomersUpToDate = async (req, res) => {
  try {
    const allCustomers = await knex("clients")
      .select("name", "clients.id")
      .orderBy("clients.id");
    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }
    const chargesClients = [];
    for (let customer of allCustomers) {
      const chargesCustomer = await knex("charges")
        .leftJoin("clients", "clients.id", "charges.client_id")
        .select("*")
        .where({
          client_id: customer.id,
        });

      const checkOverdueCharge = chargesCustomer.find(
        (charge) => !charge.paid && charge.due_date < currentMoment()
      );

      if (!checkOverdueCharge) {
        for (let charge of chargesCustomer) {
          if (
            (!charge.paid && charge.due_date > currentMoment()) ||
            charge.paid
          ) {
            chargesClients.push(charge);
            break;
          }
        }
      }
    }

    return res.status(200).json(chargesClients);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const allCustomersUpToDate = async (req, res) => {
  const { offset } = req.query;
  const p = offset ? offset : 0;
  try {
    const allCustomers = await knex("clients")
      .select("name", "cpf", "email", "phone", "id")
      .offset(p)
      .orderBy("id");
    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }
    const customersData = [];
    for (let customer of allCustomers) {
      const chargesCustomer = await knex("charges").where({
        client_id: customer.id,
      });
      const checkOverdueCharge = chargesCustomer.find(
        (charge) => !charge.paid && charge.due_date < currentMoment()
      );
      if (!checkOverdueCharge) {
        customer.status = "Em dia";
        customersData.push(customer);
      }
    }
    return res.status(200).json(customersData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const customers = async (req, res) => {
  const { offset } = req.query;

  const p = offset ? offset : 0;

  try {
    const allCustomers = await knex("clients")
      .select("name", "cpf", "email", "phone", "id")
      .offset(p)
      .limit(10)
      .orderBy("id");

    if (!allCustomers || allCustomers.length === 0) {
      return res.status(200).json([]);
    }

    const customersData = [];

    for (let customer of allCustomers) {
      const chargesCustomer = await knex("charges").where({
        client_id: customer.id,
      });

      const checkOverdueCharge = chargesCustomer.find(
        (charge) => !charge.paid && charge.due_date < currentMoment()
      );

      if (checkOverdueCharge) {
        customer.status = "Inadimplente";
      } else {
        customer.status = "Em dia";
      }

      customersData.push(customer);
    }

    return res.status(200).json(customersData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const customerDetail = async (req, res) => {
  const { id_customer } = req.params;

  try {
    const customer = await knex
      .select(
        "name",
        "email",
        "adress",
        "phone",
        "district",
        "cpf",
        "complement",
        "cep",
        "city",
        "uf"
      )
      .from("clients")
      .where("clients.id", "=", id_customer);

    if (!customer || customer.length === 0) {
      return res.status(200).json([]);
    }

    const customerCharges = await knex
      .select("charges.id", "due_date", "value", "paid", "description")
      .from("charges")
      .where("charges.client_id", "=", id_customer);

    if (!customerCharges || customerCharges.length === 0) {
      return res.status(200).json([]);
    }

    const checkBillingStatus = customerCharges.map((charge) => {
      if (charge.paid === false && charge.due_date < currentMoment()) {
        charge.status = "Vencida";
      }
      if (charge.paid === false && charge.due_date > currentMoment()) {
        charge.status = "Pendente";
      }
      if (charge.paid === true) {
        charge.status = "Paga";
      }

      charge.due_date = format(charge.due_date, "dd-MM-yyyy");
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
    return res.status(400).json({ message: error.message });
  }
};

const customerUpdate = async (req, res) => {
  const { id_customer } = req.params;
  const { name, email, phone, adress, complement, cep, district, city, uf } =
    req.body;

  if (
    !name &&
    !email &&
    !phone &&
    !adress &&
    !complement &&
    !cep &&
    !district &&
    !city &&
    !uf
  ) {
    return res.status(400).json({
      error:
        "é necessário informar ao menos um campo para fazer a atualização do cliente",
    });
  }

  try {
    await customerUpdateSchema.validate(req.body);

    const customerExists = await knex("clients")
      .where("clients.id", "=", id_customer)
      .first();

    if (!customerExists || customerExists.length === 0) {
      return res.status(404).json({ error: "cliente não encontrado" });
    }

    if (email) {
      const checkEmail = await knex("clients").where({ email }).first();

      if (checkEmail) {
        return res.status(400).json({ error: "email já cadastrado" });
      }
    }

    const clientEdition = await knex("clients")
      .update(req.body)
      .where("clients.id", "=", id_customer);

    if (!clientEdition || clientEdition.length === 0) {
      return res
        .status(400)
        .json({ error: "não foi possível atualizar o cliente" });
    }

    return res
      .status(200)
      .json({ message: "atualização do cliente concluída com sucesso" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
