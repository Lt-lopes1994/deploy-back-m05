const loginSchema = require('../validations/loginSchema')
const knex = require('../scripts/conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errors } = require('../scripts/error-messages');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await loginSchema.validate(req.body);

        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(404).json(errors.userNotFound);
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json(errors.loginIncorrect);
        }

        const idTokenUser = { id: user.id };

        const token = jwt.sign(idTokenUser, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: pass, ...userInformation } = user;

        return res.status(200).json({
            user: userInformation,
            token
        });
    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }

}

module.exports = login;