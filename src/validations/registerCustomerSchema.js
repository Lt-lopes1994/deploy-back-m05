const yup = require("./yup");

const registerCustomerSchema = yup.object().shape({
  name: yup.string().required(),

  email: yup.string().email().required(),

  cpf: yup.string().length(11).required(),

  phone: yup.string().length(11).required(),

  city: yup.string().required(),

  uf: yup.string().required(),
});

module.exports = registerCustomerSchema;
