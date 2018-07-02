const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const models = require("../../../models");
const Boom = require("boom");

const removeOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
    const officerAllegation = await models.officer_allegation.findById(
      request.params.officerAllegationId
    );

    if (!officerAllegation) {
      next(Boom.notFound("Officer Allegation does not exist"));
    }

    await officerAllegation.destroy();

    const caseOfficer = await officerAllegation.getCaseOfficer();
    const updatedCase = await getCaseWithAllAssociations(caseOfficer.caseId);
    response.status(200).send(updatedCase);
  }
);

module.exports = removeOfficerAllegation;
