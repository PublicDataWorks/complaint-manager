import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import checkForValidStatus from "../checkForValidStatus";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  LETTER_TYPE,
  REFERRAL_LETTER_VERSION
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../auditDataAccess";
import getCaseWithAllAssociations from "../../../getCaseWithAllAssociations";
import generateLetterBody from "../generateLetterBody";
import constructFilename from "../constructFilename";
import { letterTypeFromHtml } from "../getLetterType/getLetterType";

require("../../../../handlebarHelpers");

const getLetterPreview = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await checkForValidStatus(caseId);

  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );

    const referralLetter = await models.referral_letter.findOne(
      { where: { caseId } },
      transaction
    );

    let letterAddresses = {
      recipient: referralLetter.recipient,
      sender: referralLetter.sender,
      transcribedBy: referralLetter.transcribedBy
    };

    let html;
    const letterType = letterTypeFromHtml(referralLetter.editedLetterHtml);
    if (letterType === LETTER_TYPE.EDITED) {
      html = referralLetter.editedLetterHtml;
    } else {
      html = await generateLetterBody(caseId, transaction);
    }
    let lastEdited = referralLetter.updatedAt;

    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);

    const finalFilename = constructFilename(
      caseDetails,
      REFERRAL_LETTER_VERSION.FINAL
    );

    const draftFilename = constructFilename(
      caseDetails,
      REFERRAL_LETTER_VERSION.DRAFT,
      letterType
    );

    response.send({
      letterHtml: html,
      addresses: letterAddresses,
      letterType: letterType,
      lastEdited: lastEdited,
      caseDetails: caseDetails,
      finalFilename: finalFilename,
      draftFilename: draftFilename
    });
  });
});

export default getLetterPreview;
