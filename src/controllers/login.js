const loginSchema = require('../validations/loginSchema')
const knex = require('../scripts/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretToken = require('../scripts/secretToken');
const { errors } = require('../scripts/error-messages');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await loginSchema.validate(req.body);

        const getUser = await knex('users')
            .where({ email })
            .first();

        if (!getUser) {
            return res.status(400).json(errors.loginIncorrect);
        }

        const correctPassword = await bcrypt.compare(password, getUser.password);
        if (!correctPassword) {
            return res.status(400).json(errors.loginIncorrect);
        }

        const idTokenUser = { id: getUser.id };

        const token = jwt.sign(idTokenUser, secretToken, { expiresIn: '1h' });

        const {password: _, ...userInformation } = getUser;


        return res.json({
            user: {
                id: getUser.id,
                name: getUser.name,
                email: getUser.email,
            },
            token
        });
    } catch (error) {
        return res.status(500).json(error.message);
    };

};

module.exports = login;