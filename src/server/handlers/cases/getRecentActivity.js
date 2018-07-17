const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");
const auditDataAccess = require("../auditDataAccess");

const getRecentActivity = asyncMiddleWare(async (request, response) => {
  const recentActivity = await models.sequelize.transaction(
    async transaction => {
      const recentActivity = await models.case_note.findAll({
        where: {
          caseId: request.params.id
        },
        auditUser: request.nickname,
        transaction
      });

      await auditDataAccess(
        request.nickname,
        request.params.id,
        AUDIT_SUBJECT.CASE_NOTES,
        transaction
      );

      return recentActivity;
    }
  );
  response.send(recentActivity);
});

module.exports = getRecentActivity;
