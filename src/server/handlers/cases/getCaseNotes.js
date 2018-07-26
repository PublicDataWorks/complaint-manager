const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");
const auditDataAccess = require("../auditDataAccess");

const getCaseNotes = asyncMiddleWare(async (request, response) => {
  const caseNotes = await models.sequelize.transaction(
    async transaction => {
      const caseNotes = await models.case_note.findAll({
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

      return caseNotes;
    }
  );
  response.send(caseNotes);
});

module.exports = getCaseNotes;
