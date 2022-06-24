const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginSchema = require("../validations/loginSchema");
const knex = require("../scripts/conection");
const { errors } = require("../scripts/error-messages");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await loginSchema.validate(req.body);

    const getUser = await knex("users").where({ email }).first();

    if (!getUser) {
      return res.status(400).json(errors.loginIncorrect);
    }

    const correctPassword = await bcrypt.compare(password, getUser.password);
    if (!correctPassword) {
      return res.status(400).json(errors.loginIncorrect);
    }

    const token = jwt.sign({ id: getUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userData } = getUser;

    return res.json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = login;
