import { NOT_FOUND_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");
const _ = require("lodash");

const editOfficerAllegation = asyncMiddleware(async (request, response) => {
  const updatedCase = await models.sequelize.transaction(async transaction => {
    const officerAllegation = await models.officer_allegation.findById(
      request.params.officerAllegationId,
      { transaction }
    );

    if (!officerAllegation) {
      throw Boom.notFound(NOT_FOUND_ERRORS.OFFICER_ALLEGATION_NOT_FOUND);
    }

    const allegationAttributes = _.pick(request.body, ["details", "severity"]);

    await officerAllegation.update(allegationAttributes, {
      auditUser: request.nickname,
      transaction
    });

    const caseOfficer = await officerAllegation.getCaseOfficer({ transaction });

    await auditDataAccess(
      request.nickname,
      caseOfficer.caseId,
      AUDIT_SUBJECT.CASE_DETAILS
    );

    return await getCaseWithAllAssociations(caseOfficer.caseId, transaction);
  });

  response.status(200).send(updatedCase);
});

module.exports = editOfficerAllegation;
