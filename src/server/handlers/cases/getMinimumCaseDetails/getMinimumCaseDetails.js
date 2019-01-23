import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../models";
import auditDataAccess from "../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import { getCaseWithoutAssociations } from "../../getCaseHelpers";

const getMinimumCaseDetails = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const minimumCaseDetails = await models.sequelize.transaction(
      async transaction => {
        await auditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.MINIMUM_CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED
        );

        const singleCase = await getCaseWithoutAssociations(
          caseId,
          transaction
        );

        return {
          caseReference: singleCase.caseReference,
          status: singleCase.status
        };
      }
    );

    response.status(200).send(minimumCaseDetails);
  }
);

export default getMinimumCaseDetails;
