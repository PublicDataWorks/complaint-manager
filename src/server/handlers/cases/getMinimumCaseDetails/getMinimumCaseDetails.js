import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../complaintManager/models";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../audits/auditDataAccess";

const getMinimumCaseDetails = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const minimumCaseDetails = await models.sequelize.transaction(
      async transaction => {
        const singleCase = await models.cases.findByPk(caseId, {
          attributes: [
            "year",
            "caseNumber",
            "complaintType",
            "status",
            "caseReference"
          ],
          paranoid: false,
          transaction
        });

        const responseData = {
          caseReference: singleCase.caseReference,
          status: singleCase.status
        };

        const auditDetails = {
          [models.cases.name]: {
            attributes: ["caseReference", "status"],
            model: models.cases.name
          }
        };

        await auditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          auditDetails,
          transaction
        );

        return responseData;
      }
    );

    response.status(200).send(minimumCaseDetails);
  }
);

export default getMinimumCaseDetails;
