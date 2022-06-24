const bcrypt = require("bcrypt");

const knex = require("../scripts/conection");
const userSchema = require("../validations/userSchema");
const fieldsToUser = require("../validations/requiredFields");
const usersTemplate = require("../templates/usersTemplate");
const userUpdateSchema = require("../validations/userUpdateSchema");
const messages = require("../scripts/messages");

const errors = require("../scripts/error-messages");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await fieldsToUser.validate(req.body);

    const getEmail = await knex("users").where({ email }).first();

    if (getEmail) {
      return res.status(400).json(errors.userExists);
    }

    const SALT = 10;
    const hash = await bcrypt.hash(password.trim(), SALT);

    const addUser = await knex("users").insert({ name, email, password: hash });

    return res.status(201).json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const informationToTheUserHimself = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  const { name, email, cpf, phone, password } = req.body;

  if (!name && !email && !phone && !cpf && !password) {
    return res.status(400).json({
      error:
        "é necessário informar ao menos um campo para fazer a atualização do usuário",
    });
  }

  try {
    await userUpdateSchema.validate(req.body);

    const userExists = await knex("users").where("users.id", "=", id).first();

    if (!userExists || userExists.length === 0) {
      return res.status(404).json({ message: "usuário não encontrado" });
    }

    if (email) {
      const checkEmail = await knex("users").where({ email }).first();

      if (checkEmail) {
        return res.status(400).json({ message: "email já cadastrado" });
      }
    }

    const userEdition = await knex("users")
      .update(req.body)
      .where("users.id", "=", id);

    if (!userEdition || userEdition.length === 0) {
      return res
        .status(400)
        .json({ message: "não foi possível atualizar o usuário" });
    }

    return res
      .status(200)
      .json({ message: "atualização do usuário concluída com sucesso" });
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
      return res.status(404).json(errors.userNotFound);
    }

    const deletedUser = await knex("users").del().where({ id: userLogin.id });

    if (!deletedUser) {
      return res.status(400).json(errors.userDelete);
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
  informationToTheUserHimself,
  updateUser,
  deleteUser,
};
