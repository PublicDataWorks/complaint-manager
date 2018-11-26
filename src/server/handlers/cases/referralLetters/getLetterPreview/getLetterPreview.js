import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import checkForValidStatus from "../checkForValidStatus";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../auditDataAccess";
import getCaseWithAllAssociations from "../../../getCaseWithAllAssociations";
import generateReferralLetterFromCaseData from "../generateReferralLetterFromCaseData";

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
    const edited = referralLetter.editedLetterHtml != null;
    if (edited) {
      html = referralLetter.editedLetterHtml;
    } else {
      html = await generateReferralLetterFromCaseData(caseId, transaction);
    }

    let editHistory = { edited: edited };
    if (edited) {
      editHistory.lastEdited = referralLetter.updatedAt;
    }
    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    response.send({
      letterHtml: html,
      addresses: letterAddresses,
      editHistory: editHistory,
      caseDetails: caseDetails
    });
  });
});

export default getLetterPreview;
