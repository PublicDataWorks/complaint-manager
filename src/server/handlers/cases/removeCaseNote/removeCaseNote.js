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

    await models.cases.update(
      {
        status: "Active"
      },
      {
        where: {
          id: caseId
        },
        auditUser: req.nickname,
        transaction
      }
    );

    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    const recentActivity = await models.case_note.findAll({
      where: { caseId },
      transaction
    });

    return {
      caseDetails,
      recentActivity
    };
  });
  res.status(200).send(currentCase);
});

module.exports = removeCaseNote;
