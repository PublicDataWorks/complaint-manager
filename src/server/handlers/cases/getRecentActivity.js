const {AUDIT_SUBJECT, DATA_ACCESSED, AUDIT_TYPE} = require("../../../sharedUtilities/constants");

const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");

const getRecentActivity = asyncMiddleWare(async (request, response) => {
  const recentActivity = await models.sequelize.transaction(async transaction => {
    const recentActivity = await models.case_note.findAll({
      where: {
        caseId: request.params.id
      },
      auditUser: request.nickname,
      transaction
    });

    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_NOTES,
        caseId: request.params.id,
        user: request.nickname
      },
      { transaction }
    );

    return recentActivity;
  });
  response.send(recentActivity);
});

module.exports = getRecentActivity;
