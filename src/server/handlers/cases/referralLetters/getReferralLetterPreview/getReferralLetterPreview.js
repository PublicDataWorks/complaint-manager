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
import { editStatusFromHtml } from "../getReferralLetterEditStatus/getReferralLetterEditStatus";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../../audits/getQueryAuditAccessDetails";
import _ from "lodash";
import auditDataAccess from "../../../audits/auditDataAccess";

require("../../../../handlebarHelpers");
const {
  signatureKeys
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/content.json`);
const {
  generateSender
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/helpers.js`);

const getReferralLetterPreview = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);

    await models.sequelize.transaction(async transaction => {
      // update sender to the logged in user if the logged in user is an authorized sender
      let sender = Object.values(signatureKeys).find(
        key => key.nickname === request.nickname
      );
      if (sender) {
        await models.referral_letter.update(
          { sender: generateSender(sender) },
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

      const editStatus = editStatusFromHtml(referralLetter.editedLetterHtml);

      const htmlAndAuditDetails = await getHtmlAndAuditDetails(
        editStatus,
        caseId,
        referralLetter,
        transaction
      );
      const html = htmlAndAuditDetails.html;
      const referralLetterBodyAuditDetails = htmlAndAuditDetails.auditDetails;

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
    const referralLetterBodyAndAuditDetails =
      await generateReferralLetterBodyAndAuditDetails(caseId, transaction);
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
