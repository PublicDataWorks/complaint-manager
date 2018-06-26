const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom")

const editOfficerAllegation = asyncMiddleware(
  async (request, response ) => {
    const officerAllegation = await models.officer_allegation.findById(
      request.params.officerAllegationId
    );

    if (!officerAllegation){
        throw Boom.notFound("Officer Allegation does not exist")
    }

    const newDetails = request.body.details;

    await officerAllegation.update(
      { details: newDetails },
      { auditUser: request.nickname }
    );

    const caseOfficer = await officerAllegation.getCaseOfficer();
    const updatedCase = await getCaseWithAllAssociations(caseOfficer.caseId);

    response.status(200).send(updatedCase);
  }
);

module.exports = editOfficerAllegation;
