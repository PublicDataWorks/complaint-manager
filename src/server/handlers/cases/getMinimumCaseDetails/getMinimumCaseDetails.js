import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../models";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const getMinimumCaseDetails = asyncMiddleware(
  async (request, response, next) => {
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const caseId = request.params.caseId;
    const minimumCaseDetails = await models.sequelize.transaction(
      async transaction => {
        const singleCase = await models.cases.findByPk(caseId, {
          attributes: ["year", "caseNumber", "complaintType", "status"],
          paranoid: false,
          transaction
        });

        const responseData = {
          caseReference: singleCase.caseReference,
          status: singleCase.status
        };

        const auditDetails = {
          [models.cases.name]: { attributes: ["caseReference", "status"] }
        };

        if (newAuditFeatureToggle) {
          await auditDataAccess(
            request.nickname,
            caseId,
            AUDIT_SUBJECT.CASE_DETAILS,
            auditDetails,
            transaction
          );
        } else {
          await legacyAuditDataAccess(
            request.nickname,
            caseId,
            AUDIT_SUBJECT.CASE_DETAILS,
            transaction,
            AUDIT_ACTION.DATA_ACCESSED,
            auditDetails
          );
        }

        return responseData;
      }
    );

    response.status(200).send(minimumCaseDetails);
  }
);

export default getMinimumCaseDetails;
