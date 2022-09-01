import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";
import { updateCaseToActiveIfInitial } from "../../cases/helpers/caseStatusHelpers";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models");
const Boom = require("boom");

const removeOfficerAllegation = asyncMiddleware(
  async (request, response, next) => {
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

        await updateCaseToActiveIfInitial(
          caseOfficer.caseId,
          request.nickname,
          transaction
        );

        const caseDetailsAndAuditDetails =
          await getCaseWithAllAssociationsAndAuditDetails(
            caseOfficer.caseId,
            transaction,
            request.permissions
          );
        const caseDetails = caseDetailsAndAuditDetails.caseDetails;
        const auditDetails = caseDetailsAndAuditDetails.auditDetails;

        await auditDataAccess(
          request.nickname,
          caseOfficer.caseId,
          MANAGER_TYPE.COMPLAINT,
          AUDIT_SUBJECT.CASE_DETAILS,
          auditDetails,
          transaction
        );

        return caseDetails;
      }
    );

    response.status(200).send(await updatedCase.toJSON());
  }
);

module.exports = removeOfficerAllegation;
