const models = require("../../../models");

const getCaseOfficer = async (request, response, next) => {
  try {
    const caseOfficer = await models.case_officer.findById(
      request.params.caseOfficerId,
      {
        include: [models.officer],
        returning: true
      }
    );

    response.status(200).send(caseOfficer);
  } catch (error) {
    next(error);
  }
};

module.exports = getCaseOfficer;
