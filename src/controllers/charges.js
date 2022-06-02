const knex = require('../scripts/conection');
const { format } = require('date-fns');
const { errors } = require('../scripts/error-messages');
const billingRegisterSchema = require('../validations/billingRegisterSchema');

const chargesPaid = async (req, res) => {
    try {
        const totalAmountBillsPaid = await knex('charges')
            .select(knex.raw(`sum(value) as total_amount_bills_paid`))
            .where('paid', '=', true)
            .first();

        if (Number(totalAmountBillsPaid.total_amount_bills_paid) === 0 || !totalAmountBillsPaid.total_amount_bills_paid) {
            return res.status(200).json(0);
        }

        return res.status(200).json(totalAmountBillsPaid);
    } catch (error) {
        return res.status(400).json({ "message": error.message })
    }
}

const currentMoment = format(new Date(), 'yyyy.MM.dd');

const overdueCharges = async (req, res) => {
    try {
        const totalAmountOverdueCharges = await knex('charges')
            .select(knex.raw(`sum(value) as total_amount_overdue_charges`))
            .where('paid', '=', false)
            .where('due_date', '<', currentMoment)
            .first();

        if (Number(totalAmountOverdueCharges.total_amount_overdue_charges) === 0 || !totalAmountOverdueCharges.total_amount_overdue_charges) {
            return res.status(200).json(0);
        }

        return res.status(200).json(totalAmountOverdueCharges);
    } catch (error) {
        return res.status(400).json({ 'message': error.message })
    }
}

const anticipatedCharges = async (req, res) => {
    try {
        const totalAmountExpectedAccounts = await knex('charges')
            .select(knex.raw(`sum(value) as total_amount_expected_accounts`))
            .where('paid', '=', false)
            .where('due_date', '>', currentMoment)
            .first();

        if (Number(totalAmountExpectedAccounts.total_amount_expected_accounts) === 0 || !totalAmountExpectedAccounts.total_amount_expected_accounts) {
            return res.status(200).json(0);
        }

        return res.status(200).json(totalAmountExpectedAccounts);
    } catch (error) {
        return res.status(400).json({ "message": error.message })
    }
}

const highlightsOverdueCollections = async (req, res) => {
    try {
        const expiredHighlight = await knex.select('clients.name', 'charges.id as id_charge', 'value', 'client_id')
            .from('charges')
            .leftJoin('clients', 'clients.id', 'charges.user_id')
            .where('paid', '=', false)
            .where('due_date', '<', currentMoment)
            .limit(4);

        if (!expiredHighlight || expiredHighlight.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(expiredHighlight);
    } catch (error) {
        return res.status(400).json({ "message": error.message })
    }
}

const highlightsExpectedCharges = async (req, res) => {
    try {
        const predictedHighlight = await knex.select('clients.name', 'charges.id as id_charge', 'value', 'client_id')
            .from('charges')
            .leftJoin('clients', 'clients.id', 'charges.user_id')
            .where('paid', '=', false)
            .where('due_date', '>', currentMoment)
            .limit(4);

        if (!predictedHighlight || predictedHighlight.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(predictedHighlight);
    } catch (error) {
        return res.status(400).json({ "message": error.message })
    }
}

const highlightsPaidCharges = async (req, res) => {
    try {
        const paidHighlights = await knex.select('clients.name', 'charges.id as id_charge', 'value', 'client_id')
            .from('charges')
            .leftJoin('clients', 'clients.id', 'charges.user_id')
            .where('paid', '=', true)
            .limit(4);

        if (!paidHighlights || paidHighlights.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(paidHighlights);
    } catch (error) {
        return res.status(400).json({ "message": error.message })
    }
}

const billingRegister = async (req, res) => {
    const { client_id } = req.params;
    const { user_id, description, due_date, value, status } = req.body;

    try {
        const clientExist = await knex('client')
            .where({ id: client_id })
            .first();

        if (!clientExist) {
            return res.status(404).json({ 'error': 'não existe esse cliente' });
        }

        await billingRegisterSchema.validate(req.body);

        const userExist = await knex('users')
            .where({ id: user_id })
            .first();

        if (!userExist) {
            return res.status(404).json({ 'error': 'não existe esse usuário' });
        }

        const newCharge = await knex('charges')
            .insert({ user_id, client_id, value, paid: status, due_date })
            .returning('*');

        if (!newCharge) {
            return res.status(400).json({ 'error': 'não foi possível cadastrar a cobrança' });
        }

        return res.status(201).json({ 'message': 'cobrança cadastrada com sucesso' });
    } catch (error) {
        return res.status(400).json({ 'message': error.message })
    }
}

module.exports = {
    chargesPaid,
    overdueCharges,
    anticipatedCharges,
    highlightsOverdueCollections,
    highlightsExpectedCharges,
    highlightsPaidCharges,
    billingRegister
}