const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const removeCaseNote = asyncMiddleware(async (req, res) => {
  const caseId = req.params.caseId;
  const caseNoteId = req.params.caseNoteId;

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_note.destroy({
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: req.nickname
    });

    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    const recentActivity = await models.case_note.findAll({
      where: { caseId },
      transaction
    });

    const caseAuditAttributes = {
      auditType: AUDIT_TYPE.DATA_ACCESS,
      action: DATA_ACCESSED,
      subject: AUDIT_SUBJECT.CASE_DETAILS,
      caseId,
      user: req.nickname
    };

    const caseNoteAuditAttributes = {
      auditType: AUDIT_TYPE.DATA_ACCESS,
      action: DATA_ACCESSED,
      subject: AUDIT_SUBJECT.CASE_NOTES,
      caseId,
      user: req.nickname
    };

    await models.action_audit.bulkCreate(
      [caseAuditAttributes, caseNoteAuditAttributes],
      { transaction }
    );

    return {
      caseDetails,
      recentActivity
    };
  });
  res.status(200).send(currentCase);
});

module.exports = removeCaseNote;
