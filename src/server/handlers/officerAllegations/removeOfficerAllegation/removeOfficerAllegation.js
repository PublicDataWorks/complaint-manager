import { NOT_FOUND_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const models = require("../../../models");
const Boom = require("boom");
const auditDataAccess = require("../../auditDataAccess");

const removeOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const officerAllegation = await models.officer_allegation.findById(
          request.params.officerAllegationId,
          { transaction }
        );

        if (!officerAllegation) {
          next(Boom.notFound(NOT_FOUND_ERRORS.OFFICER_ALLEGATION_NOT_FOUND));
        }

        await officerAllegation.destroy({
          auditUser: request.nickname,
          transaction
        });

        const caseOfficer = await officerAllegation.getCaseOfficer({
          transaction
        });

        await auditDataAccess(
          request.nickname,
          caseOfficer.caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction
        );

        return await getCaseWithAllAssociations(
          caseOfficer.caseId,
          transaction
        );
      }
    );

    response.status(200).send(updatedCase);
  }
);

module.exports = removeOfficerAllegation;
