import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import auditDataAccess from "../../../auditDataAccess";

import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  LETTER_TYPE
} from "../../../../../sharedUtilities/constants";

const getLetterType = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const letterType = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.LETTER_TYPE,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );

    const referralLetter = await models.referral_letter.findOne(
      { where: { caseId } },
      transaction
    );

    if (referralLetter) {
      return letterTypeFromHtml(referralLetter.editedLetterHtml);
    }
    return null;
  });

  response.status(200).send({ letterType: letterType });
});

export const letterTypeFromHtml = editedLetterHtml => {
  if (editedLetterHtml != null) {
    return LETTER_TYPE.EDITED;
  }
  return LETTER_TYPE.GENERATED;
};

export default getLetterType;
