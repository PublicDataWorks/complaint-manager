const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const auditDataAccess = require("../auditDataAccess");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const createCaseNote = asyncMiddleware(async (request, response) => {
  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_note.create(
      {
        ...request.body,
        user: request.nickname,
        caseId: request.params.id
      },
      {
        transaction,
        auditUser: request.nickname
      }
    );

    await auditDataAccess(
      request.nickname,
      request.params.id,
      AUDIT_SUBJECT.CASE_NOTES,
      transaction
    );

    await auditDataAccess(
      request.nickname,
      request.params.id,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    const recentActivity = await models.case_note.findAll({
      where: {
        caseId: request.params.id
      },
      transaction
    });

    const caseDetails = await getCaseWithAllAssociations(
      request.params.id,
      transaction
    );
    return { recentActivity, caseDetails };
  });

  response.status(201).send(currentCase);
});

module.exports = createCaseNote;
