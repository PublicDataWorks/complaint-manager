const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_ACCESSED,
  RANK_INITIATED
} = require("../../../sharedUtilities/constants");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");

const createCase = asyncMiddleware(async (req, res, next) => {
  let newCase;

  if (req.body.case.complaintType === RANK_INITIATED) {
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
  return await models.sequelize.transaction(async transaction => {
    const createdCase = await models.cases.create(
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

    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        caseId: createdCase.id,
        user: req.nickname
      },
      { transaction }
    );

    return createdCase;
  });
};

const createCaseWithCivilian = async req => {
  return await models.sequelize.transaction(async transaction => {
    const createdCase = await models.cases.create(
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

    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        caseId: createdCase.id,
        user: req.nickname
      },
      { transaction }
    );

    return createdCase;
  });
};

module.exports = createCase;
