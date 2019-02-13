import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import auditDataAccess from "../../../auditDataAccess";

import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  EDIT_STATUS
} from "../../../../../sharedUtilities/constants";

const getReferralLetterEditStatus = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const editStatus = await models.sequelize.transaction(async transaction => {
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
      return editStatusFromHtml(referralLetter.editedLetterHtml);
    }
    return null;
  });

  response.status(200).send({ editStatus: editStatus });
});

export const editStatusFromHtml = editedLetterHtml => {
  if (editedLetterHtml != null) {
    return EDIT_STATUS.EDITED;
  }
  return EDIT_STATUS.GENERATED;
};

export default getReferralLetterEditStatus;
