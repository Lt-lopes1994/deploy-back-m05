const knex = require('../scripts/conection');
const loginSchema = require('../validations/loginSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');
const registerCustomerSchema = require('../validations/registerCustomerSchema');
const { errors } = require('../scripts/error-messages');


const registerCustomer = async (req, res) => {
    const { name, email, cpf, phone, adress, cep, complement, district, city, uf } = req.body;

    try {
        await registerCustomerSchema.validate(req.body);

        const registeredEmail = await knex('users').where({ email }).first();

        if (registeredEmail) {
            return res.status(400).json(errors.userExists);
        }

        const registeredCPF = await knex('users').where({ cpf }).first();

        if (registeredCPF) {
            return res.status(400).json(errors.cpfExists);
        }

        const customer = await knex('users').insert({
            name, email, cpf, phone, adress, cep, complement, district, city, uf
        });

        if (!customer) {
            return res.status(400).json(errors.unregisteredCustomer);
        }

        return res.status(200).json({ 'mensagem': "Cliente cadastrado com sucesso" });
    } catch (error) {
        return res.status(400).json({ 'mensagem': error.message });
    }
}

const currentMoment = format(new Date(), 'dd.MM.yyyy');

const delinquentCustomerHighligths = async (req, res) => {
    try {
        const sampleDelinquentCustomers = await knex('cobrancas')
            .leftJoin('clientes', 'nome', 'data_vencimento', 'valor')
            .where({ pago: false })
            .andWhere('data_vencimento', '<', currentMoment)
            .limit(4)
            .orderBy(desc);

        if (!sampleDelinquentCustomers) {
            return res.status(400).json(errors.noReturnFromDefaultingCustomers);
        }

        if (sampleDelinquentCustomers.length == 0) {
            return res.status(404).json(errors.noDelinquentCustomers);
        }

        return res.status(200).json(sampleDelinquentCustomers);
    } catch (error) {
        return res.status(400).json({ 'message': error.message });
    }
}

const highlightsCustomersUpToDate = async (req, res) => {
    try {
        const sampleRegularizedCustomers = await knex('cobrancas')
            .leftJoin('clientes', 'nome', 'data_vencimento', 'valor')
            .where({ pago: true })
            .limit(4)
            .orderBy(desc);

        if (!sampleRegularizedCustomers) {
            return res.status(400).json(errors.noReturnFromRegularizedCustomers);
        }

        if (sampleRegularizedCustomers.length == 0) {
            return res.status(404).json(errors.noRegularizedCustomers);
        }

        return res.status(200).json(sampleRegularizedCustomers);
    } catch (error) {
        return res.status(400).json({ 'message': error.message });
    }
}

const customers = async (req, res) => {
    try {
        const allCustomers = await knex('clients')
            .select('name', 'cpf', 'email', 'phone');


        if (!allCustomers) {
            return res.status(400).json(errors.noReturnFromCustomers);
        }

        return res.status(200).json(allCustomers);
    } catch (error) {
        return res.status(400).json({ 'message': error.message });
    }
}

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
    customers
}