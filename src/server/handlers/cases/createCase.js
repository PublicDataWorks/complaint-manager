const {
  AUDIT_SUBJECT,
  RANK_INITIATED
} = require("../../../sharedUtilities/constants");
const auditDataAccess = require("../auditDataAccess");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const Boom = require("boom");

const createCase = asyncMiddleware(async (req, res, next) => {
  let newCase = {};

  await models.sequelize.transaction(async transaction => {
    if (req.body.case.complaintType === RANK_INITIATED) {
      newCase = await createCaseWithoutCivilian(req, transaction);
    } else {
      const first = req.body.civilian.firstName;
      const last = req.body.civilian.lastName;

      if (invalidName(first) || invalidName(last)) {
        throw Boom.badRequest("Invalid civilian name");
      } else {
        newCase = await createCaseWithCivilian(req, transaction);
      }
    }

    await auditDataAccess(
      req.nickname,
      newCase.id,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );
  });

  res.status(201).send(newCase);
});

const invalidName = input => {
  return !input || input.length === 0 || input.length > 25;
};

const createCaseWithoutCivilian = async (req, transaction) => {
  return await models.cases.create(
    {
      ...req.body.case,
      createdBy: req.nickname,
      assignedTo: req.nickname
    },
    {
      auditUser: req.nickname,
      transaction
    }
  );
};

const createCaseWithCivilian = async (req, transaction) => {
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
      auditUser: req.nickname,
      transaction
    }
  );
};

module.exports = createCase;
