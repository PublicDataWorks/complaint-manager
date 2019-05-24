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
import { getCaseWithAllAssociationsAndAuditDetails } from "../../../getCaseHelpers";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import constructFilename from "../constructFilename";
import { editStatusFromHtml } from "../getReferralLetterEditStatus/getReferralLetterEditStatus";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../../getQueryAuditAccessDetails";
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

    await models.sequelize.transaction(async transaction => {
      const referralLetterAndAuditDetails = await getReferralLetterAndAuditDetails(
        caseId,
        transaction
      );
      const referralLetter = referralLetterAndAuditDetails.referralLetter;
      const referralLetterAuditDetails =
        referralLetterAndAuditDetails.auditDetails;

      const editStatus = editStatusFromHtml(referralLetter.editedLetterHtml);

      const htmlAndAuditDetails = await getHtmlAndAuditDetails(
        editStatus,
        caseId,
        referralLetter,
        transaction
      );
      const html = htmlAndAuditDetails.html;
      const referralLetterBodyAuditDetails = htmlAndAuditDetails.auditDetails;

      const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
        caseId,
        transaction
      );
      const caseDetails = caseDetailsAndAuditDetails.caseDetails;
      const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;

      const auditDetails = combineAuditDetailsAndAddReferralLetterCustomFields(
        referralLetterBodyAuditDetails,
        referralLetterAuditDetails,
        caseAuditDetails
      );

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

      let lastEdited = referralLetter.updatedAt;

      const finalFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.FINAL
      );

      const draftFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.DRAFT,
        editStatus
      );

      let letterAddresses = {
        recipient: referralLetter.recipient,
        sender: referralLetter.sender,
        transcribedBy: referralLetter.transcribedBy
      };

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

const getHtmlAndAuditDetails = async (
  editStatus,
  caseId,
  referralLetter,
  transaction
) => {
  let html, referralLetterBodyAuditDetails;

  if (editStatus === EDIT_STATUS.EDITED) {
    html = referralLetter.editedLetterHtml;
    referralLetterBodyAuditDetails = {};
  } else {
    const referralLetterBodyAndAuditDetails = await generateReferralLetterBodyAndAuditDetails(
      caseId,
      transaction
    );
    html = referralLetterBodyAndAuditDetails.referralLetterBody;
    referralLetterBodyAuditDetails =
      referralLetterBodyAndAuditDetails.auditDetails;
  }

  return { html: html, auditDetails: referralLetterBodyAuditDetails };
};

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
