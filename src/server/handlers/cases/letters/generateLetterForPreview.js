import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";
import constructFilename from "../referralLetters/constructFilename";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import { determineLetterBody } from "../referralLetters/generateLetterPdfBuffer";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import {
  AUDIT_SUBJECT,
  EDIT_STATUS,
  MANAGER_TYPE,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../audits/auditDataAccess";

const generateLetterForPreview = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const existingCase = await models.cases.findByPk(caseId);

    if (existingCase.isArchived) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE);
    }

    await models.sequelize.transaction(async transaction => {
      const letter = await models.letter.findByPk(request.params.letterId, {
        include: [{ model: models.letter_types, as: "letterType" }],
        transaction
      });

      let sender = await models.signers.findOne({
        where: { nickname: request.nickname }
      });

      if (sender) {
        await models.letter.update(
          { sender: `${sender.name}\n${sender.title}\n${sender.phone}` },
          {
            where: { caseId },
            auditUser: request.nickname
          }
        );
      }

      const { html, auditDetails: letterBodyAuditDetails } =
        await determineLetterBody(
          letter.editedLetterHtml,
          () => ({}),
          letter.letterType,
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

      await auditDataAccess(
        request.nickname,
        caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.LETTER_PREVIEW,
        caseAuditDetails,
        transaction
      );

      await auditDataAccess(
        request.nickname,
        caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.LETTER_PREVIEW,
        letterBodyAuditDetails,
        transaction
      );

      let lastEdited = letter.updatedAt;

      const finalFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.FINAL
      );

      const editStatus = letter.editedLetterHtml
        ? EDIT_STATUS.EDITED
        : EDIT_STATUS.GENERATED;

      const draftFilename = constructFilename(
        caseDetails,
        REFERRAL_LETTER_VERSION.DRAFT,
        editStatus
      );

      let letterAddresses = {
        recipient: letter.recipient,
        recipientAddress: letter.recipientAddress,
        sender: letter.sender,
        transcribedBy: letter.transcribedBy
      };

      response.status(200).send({
        letterHtml: html,
        addresses: letterAddresses,
        editStatus,
        lastEdited,
        caseDetails: await caseDetails.toJSON(),
        finalFilename: finalFilename,
        draftFilename: draftFilename
      });
    });
  }
);

export default generateLetterForPreview;
