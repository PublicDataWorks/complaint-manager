const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const editCaseOfficer = async (request, response, next) => {
  try {
    await models.case_officer.update(request.body, {
      where: {
        id: request.params.caseOfficerId
      }
    });

    const updatedCase = await getCaseWithAllAssociations(request.params.caseId);

    response.status(200).send(updatedCase);
  } catch (e) {
    next(e);
  }
};

module.exports = editCaseOfficer;
