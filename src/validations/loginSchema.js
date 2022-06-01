const yup = require('./yup');

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required(),

    password: yup
        .string()
        .length(8)
        .required()
});

module.exports = loginSchema;