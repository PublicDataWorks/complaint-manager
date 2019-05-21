import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
const models = require("../../../models");
const Boom = require("boom");
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const removeOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );
    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const officerAllegation = await models.officer_allegation.findByPk(
          request.params.officerAllegationId,
          { transaction }
        );

        if (!officerAllegation) {
          next(
            Boom.badRequest(BAD_REQUEST_ERRORS.OFFICER_ALLEGATION_NOT_FOUND)
          );
        }

        await officerAllegation.destroy({
          auditUser: request.nickname,
          transaction
        });

        const caseOfficer = await officerAllegation.getCaseOfficer({
          transaction
        });

        let auditDetails = {};
        const caseDetails = await getCaseWithAllAssociations(
          caseOfficer.caseId,
          transaction,
          auditDetails
        );
        if (newAuditFeatureToggle) {
          await auditDataAccess(
            request.nickname,
            caseOfficer.caseId,
            AUDIT_SUBJECT.CASE_DETAILS,
            auditDetails,
            transaction
          );
        } else {
          await legacyAuditDataAccess(
            request.nickname,
            caseOfficer.caseId,
            AUDIT_SUBJECT.CASE_DETAILS,
            transaction,
            AUDIT_ACTION.DATA_ACCESSED,
            auditDetails
          );
        }

        return caseDetails;
      }
    );

    response.status(200).send(updatedCase);
  }
);

module.exports = removeOfficerAllegation;
