const knex = require('../scripts/conection');

const userExists = async (id) => {
    const list = await knex("users")
    .where({ id })
    .first();
    return list;
};

const updateUser = async (id, name, email, password, cpf, phone) => {
    name = name.trim();
    email = email.trim();
    cpf = cpf && cpf.trim();
    phone = phone && phone.trim();

    const userUpdated = await knex('users')
    .where({ id })
    .update({ name, email, password, cpf, phone });

    return userUpdated;
};

module.exports = {
    userExists,
    updateUser
}