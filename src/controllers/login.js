const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

const userSchema = require('../validations/userSchema')
const knex = require('../scripts/conection');
const { errors } = require('../scripts/error-messages');
const { loginSuccess } = require('../scripts/messages');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await userSchema.loginSchema.validate(req.body);

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

        const token = jwt.sign({ id: getUser.id }, jwtSecret, { expiresIn: "2h" });

        const {password: _, ...userData } = getUser;

        return res.json({
            user: {
                id: getUser.id,
                name: getUser.name,
                email: getUser.email,
            },
            token,
            message: loginSuccess
        });
    } catch (error) {
        return res.status(500).json(error.message);
    };

};

module.exports = login;