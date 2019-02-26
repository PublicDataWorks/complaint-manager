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
import { addToExistingAuditDetails } from "../../../getQueryAuditAccessDetails";

require("../../../../handlebarHelpers");

const getReferralLetterPreview = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);

    let auditDetails = {};

    await models.sequelize.transaction(async transaction => {
      const queryOptions = {
        where: { caseId },
        transaction
      };
      const referralLetter = await models.referral_letter.findOne(queryOptions);

      addToExistingAuditDetails(
        auditDetails,
        queryOptions,
        models.referral_letter.name
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
        html = await generateReferralLetterBody(
          caseId,
          transaction,
          auditDetails
        );
      }
      let lastEdited = referralLetter.updatedAt;
      const caseDetails = await getCaseWithAllAssociations(
        caseId,
        transaction,
        auditDetails
      );

      const responseDetails = {
        letterHtml: html,
        address: letterAddresses,
        caseDetails: caseDetails
      };

      const finalFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.FINAL
      );

      const draftFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.DRAFT,
        editStatus
      );

      auditDetails[models.referral_letter.name].attributes = auditDetails[
        models.referral_letter.name
      ].attributes.concat(["editStatus", "lastEdited", "draftFilename"]);

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
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
  }
);

export default getReferralLetterPreview;
