const yup = require('./yup');

const customerUpdateSchema = yup.object().shape({
    name: yup
        .string()
        .min(4),

    email: yup
        .string()
        .email(),

    phone: yup
        .string()
        .length(11),

    address: yup
        .string(),

    complement: yup
        .string(),

    cep: yup
        .string()
        .length(8),

    district: yup
        .string(),

    city: yup
        .string(),

    uf: yup
        .string()
        .length(2)
});

module.exports = customerUpdateSchema;