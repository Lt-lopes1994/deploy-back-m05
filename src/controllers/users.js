const bcrypt = require("bcrypt");
const knex = require("../scripts/conection");
const errors = require("../scripts/error-messages");
const messages = require("../scripts/messages");
const fieldsToUser = require("../validations/requiredFields");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await fieldsToUser.validate(req.body);

    const getEmail = await knex("users").where({ email }).first();

    if (getEmail) {
      return res.status(400).json({ error: errors.userExists });
    }

    const SALT = 10;
    const hash = await bcrypt.hash(password, SALT);

    const addUser = await knex("users").insert({ name, email, password: hash });

    if (!addUser) {
      return res.status(400).json({ error: errors.couldNotSignin });
    }

    return res
      .status(201)
      .json({ message: messages.userRegisteredSuccessfully });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const informationToTheUserHimself = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  const { name, cpf, email, phone, password } = req.body;

  try {
    const user = await knex("users")
      .select("id", "name", "email", "cpf", "phone", "password")
      .where(id)
      .first();

    if (!user) {
      return res.status(404).json({ error: errors.userNotFound });
    }

    const getEmail = await knex("users")
      .where({ email })
      .whereNot({ email: user.email })
      .first();

    if (getEmail) {
      return res.status(400).json({ error: errors.userExists });
    }

    const SALT = 10;
    const hash = await bcrypt.hash(password, SALT);

    const updatedUser = await knex("users")
      .update({ name, email, cpf, phone, password: hash })
      .where({ id: userLogin.id });

    if (!updatedUser) {
      return res.status(400).json({ error: errors.userUpdate });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userLogin = req.user;

  try {
    const user = await knex("users")
      .select("id", "name", "email", "cpf", "phone", "password")
      .where({ id: userLogin.id })
      .first();

    if (!user) {
      return res.status(404).json({ error: errors.userNotFound });
    }

    const deletedUser = await knex("users").del().where({ id: userLogin.id });

    if (!deletedUser) {
      return res.status(400).json({ error: errors.userDelete });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  informationToTheUserHimself,
  updateUser,
  deleteUser,
};
