import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const models = require("../../../models");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
const _ = require("lodash");

const editOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const officerAllegation = await models.officer_allegation.findByPk(
          request.params.officerAllegationId,
          { transaction }
        );

        if (!officerAllegation) {
          throw Boom.badRequest(
            BAD_REQUEST_ERRORS.OFFICER_ALLEGATION_NOT_FOUND
          );
        }

        const allegationAttributes = _.pick(request.body, [
          "details",
          "severity"
        ]);

        await officerAllegation.update(allegationAttributes, {
          auditUser: request.nickname,
          transaction
        });

        const caseOfficer = await officerAllegation.getCaseOfficer({
          transaction
        });

        await legacyAuditDataAccess(
          request.nickname,
          caseOfficer.caseId,
          AUDIT_SUBJECT.CASE_DETAILS
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

module.exports = editOfficerAllegation;
