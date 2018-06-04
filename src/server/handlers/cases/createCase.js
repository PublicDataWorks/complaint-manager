const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");

const createCase = asyncMiddleware(async (req, res, next) => {
  let newCase;

  if (req.body.case.complainantType == "Police Officer") {
    newCase = await createCaseWithoutCivilian(req);
    res.status(201).send(newCase);
  } else {
    const first = req.body.civilian.firstName;
    const last = req.body.civilian.lastName;

    if (invalidName(first) || invalidName(last)) {
      res.sendStatus(400);
    } else {
      newCase = await createCaseWithCivilian(req);
      res.status(201).send(newCase);
    }
  }
});

const invalidName = input => {
  return !input || input.length === 0 || input.length > 25;
};

const createCaseWithoutCivilian = async req => {
  return await models.cases.create(
    {
      ...req.body.case,
      createdBy: req.nickname,
      assignedTo: req.nickname
    },
    {
      auditUser: req.nickname
    }
  );
};

const createCaseWithCivilian = async req => {
  return await models.cases.create(
    {
      ...req.body.case,
      createdBy: req.nickname,
      assignedTo: req.nickname,
      complainantCivilians: [req.body.civilian]
    },
    {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: req.nickname
        }
      ],
      auditUser: req.nickname
    }
  );
};

module.exports = createCase;
