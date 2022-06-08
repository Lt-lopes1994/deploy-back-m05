const knex = require("../scripts/conection");
const loginSchema = require("../validations/loginSchema");
const { format } = require("date-fns");
const registerCustomerSchema = require("../validations/registerCustomerSchema");
const { errors } = require("../scripts/error-messages");

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

    const registeredEmail = await knex("users").where({ email }).first();

    if (registeredEmail) {
      return res.status(400).json(errors.userExists);
    }

    const registeredCPF = await knex("users").where({ cpf }).first();

    if (registeredCPF) {
      return res.status(400).json(errors.cpfExists);
    }

    const customer = await knex("users").insert({
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
    });

    if (!customer) {
      return res.status(400).json(errors.unregisteredCustomer);
    }

    return res.status(200).json({ mensagem: "Cliente cadastrado com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const currentMoment = () => new Date();

const delinquentCustomerHighligths = async (req, res) => {
  try {
    const sampleDelinquentCustomers = await knex
      .select("client.name", "due_date", "value", "client.id")
      .from("charges")
      .leftJoin("clients", "client.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment())
      .distinctOn("client.id")
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

const highlightsCustomersUpToDate = async (req, res) => {
  try {
    const sampleRegularizedCustomers = await knex
      .select("client.name", "due_date", "value", "client.id")
      .from("charges")
      .leftJoin("clients", "client.id", "charges.client_id")
      .where("paid", "=", "true")
      .orWhere("due_date", ">", currentMoment())
      .distinctOn("client.id")
      .limit(4);

    if (
      !sampleRegularizedCustomers ||
      sampleRegularizedCustomers.length === 0
    ) {
      return res.status(200).json([]);
    }

    const dueDateFormat = sampleRegularizedCustomers.map((delinquent) => {
      delinquent.due_date = format(delinquent.due_date, "yyyy-MM-dd");
      return delinquent;
    });

    return res.status(200).json({ data: dueDateFormat });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const customers = async (req, res) => {
  try {
    const allCustomers = await knex("clients").select(
      "name",
      "cpf",
      "email",
      "phone"
    );

    if (!allCustomers) {
      return res.status(400).json(errors.noReturnFromCustomers);
    }

    return res.status(200).json(allCustomers);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// const customerDetail = async (req, res) => {
//         const {email} = req.body;

//         await loginSchema.validate(req.body);

//         const getUser = await knex('users')
//             .where({email})
//             .first();

//         if (!getUser) {
//             return res.status(400).json(errors.loginIncorrect);
//         }

//         return res.status(200).json(email);
// }

module.exports = {
  registerCustomer,
  delinquentCustomerHighligths,
  highlightsCustomersUpToDate,
  customers,
};
