const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");

const getCaseOfficer = asyncMiddleware(async (request, response) => {
  const caseOfficer = await models.case_officer.findById(
    request.params.caseOfficerId,
    {
      returning: true
    }
  );

  response.status(200).send(caseOfficer);
});

module.exports = getCaseOfficer;
