import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  EDIT_STATUS,
  REFERRAL_LETTER_VERSION
} from "../../../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../../../legacyAuditDataAccess";
import { getCaseWithAllAssociations } from "../../../getCaseHelpers";
import generateReferralLetterBody from "../generateReferralLetterBody";
import constructFilename from "../constructFilename";
import { editStatusFromHtml } from "../getReferralLetterEditStatus/getReferralLetterEditStatus";
import { generateAndAddAuditDetailsFromQuery } from "../../../getQueryAuditAccessDetails";
import _ from "lodash";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../../auditDataAccess";

require("../../../../handlebarHelpers");

const getReferralLetterPreview = asyncMiddleware(
  async (request, response, next) => {
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);

    let auditDetails = {};

    await models.sequelize.transaction(async transaction => {
      const referralLetterQueryOptions = {
        where: { caseId },
        transaction
      };
      const referralLetter = await models.referral_letter.findOne(
        referralLetterQueryOptions
      );

      generateAndAddAuditDetailsFromQuery(
        auditDetails,
        referralLetterQueryOptions,
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

      const finalFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.FINAL
      );

      const draftFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.DRAFT,
        editStatus
      );

      const formattedReferralLetterModelName = _.camelCase(
        models.referral_letter.name
      );

      auditDetails[formattedReferralLetterModelName].attributes = auditDetails[
        formattedReferralLetterModelName
      ].attributes.concat(["editStatus", "lastEdited", "draftFilename"]);

      if (newAuditFeatureToggle) {
        await auditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
          auditDetails,
          transaction
        );
      } else {
        await legacyAuditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      }

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
