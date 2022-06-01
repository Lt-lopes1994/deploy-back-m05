const env = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const knex = require('../scripts/conection');

const { errors } = require('../scripts/error-messages');
const { fieldsToUser, fieldsToLogin } = require('../validations/requiredFields');

env.config()
const jwtSecret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const validations = fieldsToUser({ name, email, password });

    if (!validations.ok) {
        return res.status(400).json(validations.message);
    }

    try {
        const getEmail = await knex('users')
            .where({ email })
            .first();

        if (getEmail) {
            return res.status(400).json(errors.userExists);
        }

        const SALT = 10;
        const hash = await bcrypt.hash(password, SALT);

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
    const userLogin = req.user;
    const { name, cpf, email, phone, password } = req.body;

    try {
        const user = await knex('users')
            .select('id', 'name', 'email', 'cpf', 'phone', 'password')
            .where({ id: userLogin.id })
            .first();

        if (!user) {
            return res.status(404).json(errors.userNotFound);
        }

        const getEmail = await knex('users')
            .where({ email })
            .whereNot({ email: user.email })
            .first();

        if (getEmail) {
            return res.status(400).json(errors.userExists);
        }

        const SALT = 10;
        const hash = await bcrypt.hash(password, SALT);

        const updatedUser = await knex('users')
            .update({ name, email, cpf, phone, password: hash })
            .where({ id: userLogin.id });

        if (!updatedUser) {
            return res.status(400).json(errors.userUpdate);
        }

        return res.status(204).json();
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