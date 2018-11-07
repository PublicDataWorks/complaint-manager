import getLetterDataForResponse from "../getLetterDataForResponse";
import asyncMiddleware from "../../../asyncMiddleware";
import checkForValidStatus from "../checkForValidStatus";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../auditDataAccess";
import models from "../../../../models";

const getReferralLetter = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  await checkForValidStatus(caseId);
  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );
    const transformedLetterData = await getLetterDataForResponse(
      caseId,
      transaction
    );
    response.send(transformedLetterData);
  });
});

module.exports = getReferralLetter;
