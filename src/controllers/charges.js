const knex = require("../scripts/conection");
const { format } = require("date-fns");
const { errors } = require("../scripts/error-messages");
const billingRegisterSchema = require("../validations/billingRegisterSchema");
const billingEditSchema = require("../validations/billingEditSchema");

const currentMoment = () => new Date();

const collectionHighlights = async (req, res) => {
  try {
    let paidHighlights = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", true)
      .limit(4);

    if (!paidHighlights || paidHighlights.length === 0) {
      paidHighlights = [];
    }

    paidHighlights.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });

    let predictedHighlight = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", ">", currentMoment())
      .limit(4);

    if (!predictedHighlight || predictedHighlight.length === 0) {
      predictedHighlight = [];
    }

    predictedHighlight.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });

    let expiredHighlight = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment())
      .limit(4);

    if (!expiredHighlight || expiredHighlight.length === 0) {
      expiredHighlight = [];
    }

    expiredHighlight.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });

    const highlightsCharges = {
      paidHighlights: paidHighlights,
      predictedHighlight: predictedHighlight,
      expiredHighlight: expiredHighlight,
    };

    return res.status(200).json(highlightsCharges);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const totalAmountAllCharges = async (req, res) => {
  try {
    let totalAmountBillsPaid = await knex("charges")
      .select(knex.raw(`sum(value) as total_amount_bills_paid`))
      .where("paid", "=", true)
      .first();

    if (
      Number(totalAmountBillsPaid.total_amount_bills_paid) === 0 ||
      !totalAmountBillsPaid.total_amount_bills_paid
    ) {
      totalAmountBillsPaid.total_amount_bills_paid = 0;
    }

    let totalAmountOverdueCharges = await knex("charges")
      .select(knex.raw(`sum(value) as total_amount_overdue_charges`))
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment())
      .first();

    if (
      Number(totalAmountOverdueCharges.total_amount_overdue_charges) === 0 ||
      !totalAmountOverdueCharges.total_amount_overdue_charges
    ) {
      totalAmountOverdueCharges.total_amount_overdue_charges = 0;
    }

    let totalAmountExpectedAccounts = await knex("charges")
      .select(knex.raw(`sum(value) as total_amount_expected_accounts`))
      .where("paid", "=", false)
      .where("due_date", ">", currentMoment())
      .first();

    if (
      Number(totalAmountExpectedAccounts.total_amount_expected_accounts) ===
        0 ||
      !totalAmountExpectedAccounts.total_amount_expected_accounts
    ) {
      totalAmountExpectedAccounts.total_amount_expected_accounts = 0;
    }

    totalAmountBillsPaid.total_amount_bills_paid = (
      totalAmountBillsPaid.total_amount_bills_paid / 100
    )
      .toFixed(2)
      .replace(".", ",");

    totalAmountExpectedAccounts.total_amount_expected_accounts = (
      totalAmountExpectedAccounts.total_amount_expected_accounts / 100
    )
      .toFixed(2)
      .replace(".", ",");

    totalAmountOverdueCharges.total_amount_overdue_charges = (
      totalAmountOverdueCharges.total_amount_overdue_charges / 100
    )
      .toFixed(2)
      .replace(".", ",");

    const valueCollections = {
      totalAmountBillsPaid: totalAmountBillsPaid.total_amount_bills_paid,
      totalAmountExpectedAccounts:
        totalAmountExpectedAccounts.total_amount_expected_accounts,
      totalAmountOverdueCharges:
        totalAmountOverdueCharges.total_amount_overdue_charges,
    };

    return res.status(200).json(valueCollections);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const highlightsOverdueCollections = async (req, res) => {
  try {
    const expiredHighlight = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.user_id")
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment())
      .limit(4);

    if (!expiredHighlight || expiredHighlight.length === 0) {
      return res.status(200).json([]);
    }

    expiredHighlight.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });

    return res.status(200).json(expiredHighlight);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const allOverdueCharges = async (req, res) => {
  try {
    const expiredHighlight = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", "<", currentMoment());

    if (!expiredHighlight || expiredHighlight.length === 0) {
      return res.status(200).json([]);
    }
    expiredHighlight.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });
    return res.status(200).json(expiredHighlight);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const highlightsExpectedCharges = async (req, res) => {
  try {
    const predictedHighlight = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.user_id")
      .where("paid", "=", false)
      .where("due_date", ">", currentMoment())
      .limit(4);

    if (!predictedHighlight || predictedHighlight.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(predictedHighlight);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const allAnticipatedCharges = async (req, res) => {
  try {
    const predictedHighlight = await knex
      .select("clients.name", "charges.id as id_charge", "value")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", false)
      .where("due_date", ">", currentMoment());

    if (!predictedHighlight || predictedHighlight.length === 0) {
      return res.status(200).json([]);
    }

    predictedHighlight.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });

    return res.status(200).json(predictedHighlight);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const highlightsPaidCharges = async (req, res) => {
  try {
    const paidHighlights = await knex
      .select("clients.name", "charges.id as id_charge", "value", "client_id")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", true)
      .distinctOn("client_id")
      .limit(4);

    if (!paidHighlights || paidHighlights.length === 0) {
      return res.status(200).json([]);
    }
    paidHighlights.map((highlight) => {
      {
        highlight.value = (highlight.value / 100).toFixed(2).replace(".", ",");
      }
    });

    return res.status(200).json(paidHighlights);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const allChargesPaid = async (req, res) => {
  try {
    const paidHighlights = await knex
      .select("clients.name", "charges.id as id_charge", "value")
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("paid", "=", true);

    if (!paidHighlights || paidHighlights.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(paidHighlights);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const billingRegister = async (req, res) => {
  const { client_id } = req.params;
  const { user_id, description, due_date, value, status } = req.body;

  if (!client_id) {
    return res.status(400).json({ error: "informe o clients_id no params" });
  }

  try {
    const clientExist = await knex("clients").where({ id: client_id }).first();

    if (!clientExist) {
      return res.status(404).json({ error: "não existe esse cliente" });
    }

    await billingRegisterSchema.validate(req.body);

    const userExist = await knex("users").where({ id: user_id }).first();

    if (!userExist) {
      return res.status(404).json({ error: "não existe esse usuário" });
    }

    const newCharge = await knex("charges")
      .insert({
        user_id,
        client_id,
        value,
        paid: status,
        due_date,
        description,
      })
      .returning("*");

    if (!newCharge) {
      return res
        .status(400)
        .json({ error: "não foi possível cadastrar a cobrança" });
    }

    return res.status(201).json({ message: "cobrança cadastrada com sucesso" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const billingList = async (req, res) => {
  const { offset } = req.query;

  const off = offset ? offset : 0;

  try {
    const charges = await knex
      .select(
        "clients.name",
        "charges.id as id_charge",
        "value",
        "due_date",
        "description",
        "paid"
      )
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .limit(9)
      .offset(off);

    if (!charges) {
      return res.status(200).json([]);
    }

    const listCharges = charges.map((charge) => {
      if (charge.paid === false && charge.due_date < currentMoment()) {
        charge.status = "Vencida";
      }
      if (charge.paid === false && charge.due_date > currentMoment()) {
        charge.status = "Pendente";
      }
      if (charge.paid === true) {
        charge.status = "Paga";
      }

      charge.due_date = format(charge.due_date, "yyyy-MM-dd");
      delete charge.paid;

      return charge;
    });

    return res.status(200).json(listCharges);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const billingEdit = async (req, res) => {
  const { id_charge } = req.params;
  const { description, paid, value, due_date } = req.body;

  if (!description && !paid && !value && !due_date) {
    return res.status(400).json({
      error:
        "é necessário informar ao menos um campo para fazer a atualização da cobrança",
    });
  }
  try {
    await billingEditSchema.validate(req.body);

    const chargeExists = await knex("charges")
      .where("charges.id", "=", id_charge)
      .first();

    if (!chargeExists || chargeExists.length === 0) {
      return res.status(404).json({ error: "cobrança não encontrada" });
    }

    const chargeUpdate = await knex("charges")
      .update(req.body)
      .where("charges.id", "=", id_charge);

    if (!chargeUpdate || chargeUpdate.length === 0) {
      return res
        .status(400)
        .json({ error: "não foi possível atualizar a cobrança" });
    }

    return res
      .status(200)
      .json({ message: "atualização da cobrança concluída com sucesso" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteCharge = async (req, res) => {
  const { id_charge } = req.params;
  const { id_customer } = req.body;

  if (!id_customer) {
    return res
      .status(400)
      .json({ error: "é necessário informar o id_customer" });
  }

  try {
    const chargeExists = await knex("charges")
      .where("charges.id", "=", id_charge)
      .first();

    if (!chargeExists || chargeExists.length === 0) {
      return res.status(404).json({ error: "cobrança não encontrada" });
    }

    const customerExists = await knex("clients")
      .where("clients.id", "=", id_customer)
      .first();

    if (!customerExists || customerExists.length === 0) {
      return res.status(404).json({ error: "cliente não encontrado" });
    }

    if (chargeExists.paid || chargeExists.due_date < currentMoment()) {
      return res.status(400).json({
        error:
          "a cobrança não pode ser deletada ou por estar vencida ou por estar paga",
      });
    }

    const deleteAccount = await knex("charges")
      .where("charges.id", "=", id_charge)
      .where("charges.client_id", "=", id_customer)
      .del();

    if (!deleteAccount || deleteAccount.length === 0) {
      return res
        .status(400)
        .json({ error: "a cobrança não pode ser excluída" });
    }

    return res.status(200).json({ message: "cobrança excluída com sucesso" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const billingDetails = async (req, res) => {
  const { id_charge } = req.params;

  try {
    const chargeExists = await knex
      .select(
        "name",
        "description",
        "due_date",
        "value",
        "charges.id as id_charge",
        "paid"
      )
      .from("charges")
      .leftJoin("clients", "clients.id", "charges.client_id")
      .where("charges.id", "=", id_charge)
      .first();

    if (!chargeExists || chargeExists.length === 0) {
      return res.status(404).json({ error: "cobrança não encontrada" });
    }

    if (
      chargeExists.paid === false &&
      chargeExists.due_date < currentMoment()
    ) {
      chargeExists.status = "Vencida";
    } else if (
      chargeExists.paid === false &&
      chargeExists.due_date > currentMoment()
    ) {
      chargeExists.status = "Pendente";
    } else {
      chargeExists.status = "Paga";
    }

    chargeExists.due_date = format(chargeExists.due_date, "dd-MM-yyyy");
    delete chargeExists.paid;

    return res.status(200).json({ data: chargeExists });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  collectionHighlights,
  totalAmountAllCharges,
  highlightsOverdueCollections,
  allOverdueCharges,
  highlightsExpectedCharges,
  allAnticipatedCharges,
  highlightsPaidCharges,
  allChargesPaid,
  billingRegister,
  billingList,
  billingEdit,
  deleteCharge,
  billingDetails,
};
