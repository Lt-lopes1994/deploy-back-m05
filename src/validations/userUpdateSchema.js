const yup = require('./yup');

const userUpdateSchema = yup.object().shape({
    name: yup
        .string()
        .min(4),

    email: yup
        .string()
        .email(),

    phone: yup
        .string()
        .length(11),

    cpf: yup
        .string()
        .length(11),

    password: yup
        .string()
        .min(8)
});

module.exports = userUpdateSchema;