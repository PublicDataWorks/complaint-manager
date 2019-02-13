import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  EDIT_STATUS,
  REFERRAL_LETTER_VERSION
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../auditDataAccess";
import { getCaseWithAllAssociations } from "../../../getCaseHelpers";
import generateReferralLetterBody from "../generateReferralLetterBody";
import constructFilename from "../constructFilename";
import { editStatusFromHtml } from "../getReferralLetterEditStatus/getReferralLetterEditStatus";

require("../../../../handlebarHelpers");

const getReferralLetterPreview = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await throwErrorIfLetterFlowUnavailable(caseId);

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
    const editStatus = editStatusFromHtml(referralLetter.editedLetterHtml);
    if (editStatus === EDIT_STATUS.EDITED) {
      html = referralLetter.editedLetterHtml;
    } else {
      html = await generateReferralLetterBody(caseId, transaction);
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
      editStatus
    );

    response.send({
      letterHtml: html,
      addresses: letterAddresses,
      editStatus: editStatus,
      lastEdited: lastEdited,
      caseDetails: caseDetails,
      finalFilename: finalFilename,
      draftFilename: draftFilename
    });
  });
});

export default getReferralLetterPreview;
