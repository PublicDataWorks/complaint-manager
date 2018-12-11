import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../models";
import auditDataAccess from "../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";

const getCaseNumber = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.id;
  const caseNumber = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_NUMBER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );

    const singleCase = await models.cases.findById(caseId, {
      transaction: transaction
    });

    return singleCase.caseNumber;
  });

  response.status(200).send({ caseNumber: caseNumber });
});

export default getCaseNumber;
