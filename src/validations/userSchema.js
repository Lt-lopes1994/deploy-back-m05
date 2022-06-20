const yup = require('./yup');

const signUpUser = yup.object().shape({
    name: yup
    .string()
    .trim()
    .required(),

    email: yup
    .string()
    .trim()
    .required(),
    password: yup
    .string()
    .trim()
    .required(),
});
  
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email()
        .trim()
        .required(),

    password: yup
        .string()
        .min(8)
        .trim()
        .required()
});


const editUser = yup.object().shape({
    name: yup
    .string()
    .trim()
    .max(180, "O campo nome não pode ter mais que 180 caracteres.")
    .required(),

    email: yup
    .string()
    .trim()
    .max(180, "O campo nome não pode ter mais que 180 caracteres.")
    .required(),

    password: yup
    .string()
    .trim(),

    cpf: yup
    .string()
    .trim()
    .max(14, "O campo cpf não pode ter mais que 14 caracteres."),

    phone: yup
    .string()
    .trim()
    .max(15, "O campo telefone não pode ter mais que 15 caracteres.")
});

const emailParams = yup.object().shape({
    email: yup
    .string()
    .trim()
    .required()
});
  

  
module.exports = { 
    loginSchema,
    signUpUser,
    editUser,
    emailParams
};