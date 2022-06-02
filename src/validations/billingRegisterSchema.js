const yup = require('./yup');

const billingRegisterSchema = yup.object().shape({

    user_id: yup
        .string()
        .required(),

    description: yup
        .string()
        .min(10)
        .required(),

    due_date: yup
        .string()
        .length(10)
        .required(),

    value: yup
        .string()
        .required(),

    status: yup
        .boolean()
        .required()
});

module.exports = billingRegisterSchema;