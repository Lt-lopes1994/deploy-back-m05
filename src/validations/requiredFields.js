const { object } = require('yup');
const yup = require('./yup');

const fieldsToUser = yup.object().shape({
    name: yup
        .string()
        .required(),

    email: yup
        .string()
        .email()
        .required(),

    password: yup
        .string()
        .min(8)
        .required()
})

module.exports = fieldsToUser;
