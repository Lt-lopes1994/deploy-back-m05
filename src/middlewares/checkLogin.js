const knex = require('../scripts/conection');
const jwt = require('jsonwebtoken');

const checkLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ 'message': 'Não autorizado' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const getUser = await knex('users').where({ id }).first();

        if (!getUser) {
            return res.status(404).json({ 'error': 'Token inválido' });
        }

        const { password, ...user } = getUser;

        req.user = user;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = checkLogin;