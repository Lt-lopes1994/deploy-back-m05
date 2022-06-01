const knex = require('../scripts/conection');
const jwt = require('jsonwebtoken');
const { errors } = require('../scripts/error-messages');
const jwtSecret = process.env.JWT_SECRET;

const checkLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || authorization === 'Beare undefined') {
        return res.status(401).json({ 'mensagem': 'O usuário precisa esta logado!' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        if (!token) {
            return res.status(400).json(errors.accountX);
        }

        const { id: jwtID } = await jwt.verify(token, jwtSecret);

        const getUser = await knex('users').where({ id: jwtID }).first();

        if (!getUser) {
            return res.status(404).json(errors.tokenX);
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: "Logue e forneça um token válido para ter acesso!" })
        }
        return res.status(400).json(error.message);
    }
}

module.exports = checkLogin;