const yup = require('./yup');

const billingEditSchema = yup.object().shape({
    description: yup
        .string()
        .min(4),

    paid: yup
        .boolean(),

    value: yup
        .string(),

    due_date: yup
        .string()
        .length(10)
});

module.exports = billingEditSchema;