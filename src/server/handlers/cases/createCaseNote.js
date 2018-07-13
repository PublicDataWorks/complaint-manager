const {
  DATA_ACCESSED,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} = require("../../../sharedUtilities/constants");

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

    const caseNoteAuditAttributes = {
      auditType: AUDIT_TYPE.DATA_ACCESS,
      action: DATA_ACCESSED,
      subject: AUDIT_SUBJECT.CASE_NOTES,
      caseId: request.params.id,
      user: request.nickname
    };

    const caseAuditAttributes = {
      auditType: AUDIT_TYPE.DATA_ACCESS,
      action: DATA_ACCESSED,
      subject: AUDIT_SUBJECT.CASE_DETAILS,
      caseId: request.params.id,
      user: request.nickname
    };

    await models.action_audit.bulkCreate(
      [caseNoteAuditAttributes, caseAuditAttributes],
      { transaction }
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
