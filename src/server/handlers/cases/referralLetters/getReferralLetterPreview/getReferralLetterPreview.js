import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../policeDataManager/models";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import {
  AUDIT_SUBJECT,
  EDIT_STATUS,
  MANAGER_TYPE,
  REFERRAL_LETTER_VERSION
} from "../../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../../getCaseHelpers";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import constructFilename from "../constructFilename";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../../audits/getQueryAuditAccessDetails";
import _ from "lodash";
import auditDataAccess from "../../../audits/auditDataAccess";
import { determineLetterBody } from "../generateLetterPdfBuffer";

require("../../../../handlebarHelpers");

const getReferralLetterPreview = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);

    await models.sequelize.transaction(async transaction => {
      // update sender to the logged in user if the logged in user is an authorized sender
      let sender = await models.signers.findOne(
        { 
          where : { nickname: request.nickname }
        }
      );
      
      if (sender) {
        await models.referral_letter.update(
          { sender: `${sender.name}\n${sender.title}\n${sender.phone}` },
          {
            where: { caseId },
            auditUser: request.nickname
          }
        );
      }

      const referralLetterAndAuditDetails =
        await getReferralLetterAndAuditDetails(caseId, transaction);
      const referralLetter = referralLetterAndAuditDetails.referralLetter;
      const referralLetterAuditDetails =
        referralLetterAndAuditDetails.auditDetails;

      const letterType = await models.letter_types.findOne({
        where: { type: "REFERRAL" }
      });

      const { html, auditDetails: referralLetterBodyAuditDetails } =
        await determineLetterBody(
          referralLetter.editedLetterHtml,
          () => ({}),
          letterType,
          caseId,
          transaction
        );

      const caseDetailsAndAuditDetails =
        await getCaseWithAllAssociationsAndAuditDetails(
          caseId,
          transaction,
          request.permissions
        );
      const caseDetails = caseDetailsAndAuditDetails.caseDetails;
      const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;

      const auditDetails = combineAuditDetailsAndAddReferralLetterCustomFields(
        referralLetterBodyAuditDetails,
        referralLetterAuditDetails,
        caseAuditDetails
      );

      await auditDataAccess(
        request.nickname,
        caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.REFERRAL_LETTER_PREVIEW,
        auditDetails,
        transaction
      );

      let lastEdited = referralLetter.updatedAt;

      const finalFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.FINAL
      );

      const editStatus = referralLetter.editedLetterHtml
        ? EDIT_STATUS.EDITED
        : EDIT_STATUS.GENERATED;
      const draftFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.DRAFT,
        editStatus
      );

      let letterAddresses = {
        recipient: referralLetter.recipient,
        recipientAddress: referralLetter.recipientAddress,
        sender: referralLetter.sender,
        transcribedBy: referralLetter.transcribedBy
      };

      response.send({
        letterHtml: html,
        addresses: letterAddresses,
        editStatus,
        lastEdited,
        caseDetails: caseDetails,
        finalFilename: finalFilename,
        draftFilename: draftFilename
      });
    });
  }
);

const getReferralLetterAndAuditDetails = async (caseId, transaction) => {
  const referralLetterQueryOptions = {
    where: { caseId },
    transaction
  };
  const referralLetter = await models.referral_letter.findOne(
    referralLetterQueryOptions
  );
  const referralLetterAuditDetails = getQueryAuditAccessDetails(
    referralLetterQueryOptions,
    models.referral_letter.name
  );

  return {
    referralLetter: referralLetter,
    auditDetails: referralLetterAuditDetails
  };
};

const combineAuditDetailsAndAddReferralLetterCustomFields = (
  referralLetterBodyAuditDetails,
  referralLetterAuditDetails,
  caseAuditDetails
) => {
  const formattedReferralLetterModelName = _.camelCase(
    models.referral_letter.name
  );

  let auditDetails = combineAuditDetails(
    referralLetterAuditDetails,
    referralLetterBodyAuditDetails
  );
  auditDetails = combineAuditDetails(auditDetails, caseAuditDetails);

  auditDetails[formattedReferralLetterModelName].attributes = auditDetails[
    formattedReferralLetterModelName
  ].attributes.concat(["editStatus", "lastEdited", "draftFilename"]);

  return auditDetails;
};

export default getReferralLetterPreview;
