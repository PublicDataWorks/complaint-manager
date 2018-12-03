import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import checkForValidStatus from "../checkForValidStatus";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  LETTER_TYPE
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../auditDataAccess";
import getCaseWithAllAssociations from "../../../getCaseWithAllAssociations";
import generateLetterBody from "../generateLetterBody";

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

    let html, letterType;
    const edited = referralLetter.editedLetterHtml != null;
    if (edited) {
      html = referralLetter.editedLetterHtml;
      letterType = LETTER_TYPE.EDITED;
    } else {
      html = await generateLetterBody(caseId, transaction);
      letterType = LETTER_TYPE.GENERATED;
    }
    let lastEdited = referralLetter.updatedAt;

    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    response.send({
      letterHtml: html,
      addresses: letterAddresses,
      letterType: letterType,
      lastEdited: lastEdited,
      caseDetails: caseDetails
    });
  });
});

export default getLetterPreview;
