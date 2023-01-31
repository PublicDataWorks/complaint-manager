import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";
import {
  AUDIT_FILE_TYPE,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../audits/auditDataAccess";
import generateLetterPdfBuffer from "../referralLetters/generateLetterPdfBuffer";
import { retrieveSignatureImageBySigner } from "../referralLetters/retrieveSignatureImage";
import Boom from "boom";
import { NOT_FOUND_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const getLetterPdf = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const letterId = request.params.letterId;
  await models.sequelize.transaction(async transaction => {
    const letter = await models.letter.findByPk(letterId, {
      transaction,
      include: [
        {
          model: models.letter_types,
          as: "letterType",
          include: [
            {
              model: models.letterTypeLetterImage,
              as: "letterTypeLetterImage"
            }
          ]
        }
      ]
    });

    if (!letter || letter.caseId + "" !== caseId) {
      throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
    }

    const pdfBufferAndAuditDetails = await generateLetterPdfBuffer(
      caseId,
      false,
      transaction,
      {
        getSignature: async args => {
          return await retrieveSignatureImageBySigner(args.sender);
        },
        letter
      }
    );

    const pdfBuffer = pdfBufferAndAuditDetails.pdfBuffer;
    const auditDetails = pdfBufferAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_FILE_TYPE.DRAFT_REFERRAL_LETTER_PDF,
      auditDetails,
      transaction
    );

    response.send(pdfBuffer);
  });
});

export default getLetterPdf;
