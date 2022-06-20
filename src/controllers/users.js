const bcrypt = require('bcrypt');

const knex = require('../scripts/conection');
const userSchema = require('../validations/userSchema');
const fieldsToUser = require('../validations/requiredFields');
const usersTemplate = require('../templates/usersTemplate');
const messages = require('../scripts/messages');

const { errors } = require('../scripts/error-messages');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await fieldsToUser.validate(req.body);

        const getEmail = await knex('users')
            .where({ email })
            .first();

        if (getEmail) {
            return res.status(400).json(errors.userExists);
        }

        const SALT = 10;
        const hash = await bcrypt.hash(password.trim(), SALT);

        const addUser = await knex('users')
            .insert({ name, email, password: hash });

        if (!addUser) {
            return res.status(400).json(errors.couldNotSignin);
        }

        return res.status(201).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const informationToTheUserHimself = async (req, res) => {
    const userLogin = req.user;

    try {
        const user = await knex('users')
            .where({ id: userLogin.id })
            .first();

        if (!user) {
            return res.status(404).json(errors.userNotFound);
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const updateUser = async (req, res) => {
    const { id } = req.user;
    let { name, email, password, cpf, phone } = req.body;

    try {
        await userSchema.editUser.validate(req.body);
        const getUser = await usersTemplate.userExists(id);
        if (!getUser) {
            return res.status(404).json(errors.userNotFound);
        }

        if (password) {
            password = await bcrypt.hash(password.trim(), 10);
        }

        if (email && email !== req.user.email) {
            const getEmail = await knex('users')
            .where({ email })
            .first();

            if (getEmail) {
                return res.status(400).json(errors.userExists);
            }
        }

        const updatedUser = await usersTemplate.updateUser(id, name, email,password, cpf, phone);

        if (!updatedUser) {
            return res.status(400).json(errors.userUpdate);
        }

        return res.status(204).json(messages.userUpdate);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const deleteUser = async (req, res) => {
    const userLogin = req.user;

    try {
        const user = await knex('users')
            .select('id', 'name', 'email', 'cpf', 'phone', 'password')
            .where({ id: userLogin.id }).first();

        if (!user) {
            return res.status(404).json(errors.userNotFound);
        }

        const deletedUser = await knex('users')
            .del()
            .where({ id: userLogin.id });

        if (!deletedUser) {
            return res.status(400).json(errors.userDelete);
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    registerUser,
    informationToTheUserHimself,
    updateUser,
    deleteUser
};