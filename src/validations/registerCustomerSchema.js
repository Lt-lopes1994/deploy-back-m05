const yup = require("./yup");

const registerCustomerSchema = yup.object().shape({
  nome: yup.string().required(),

  email: yup.string().email().required(),

  cpf: yup.string().length(11).required(),

  telefone: yup.string().length(11).required(),

  cidade: yup.string().required(),

  uf: yup.string().required(),
});

module.exports = registerCustomerSchema;
