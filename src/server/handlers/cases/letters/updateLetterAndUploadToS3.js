import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../../sharedUtilities/constants";
import { retrieveSignatureImageBySigner } from "../referralLetters/retrieveSignatureImage";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import Boom from "boom";
import constructFilename from "../referralLetters/constructFilename";
import { NOT_FOUND_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { auditFileAction } from "../../audits/auditFileAction";
import generateLetterPdfBuffer from "../referralLetters/generateLetterPdfBuffer";
import Case from "../../../policeDataManager/payloadObjects/Case";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const updateLetterAndUploadToS3 = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const caseAndAuditDetails = await models.sequelize.transaction(
      async transaction =>
        await getCaseWithAllAssociationsAndAuditDetails(
          caseId,
          transaction,
          request.permissions
        )
    );
    const existingCase = caseAndAuditDetails.caseDetails;
    const letter = await models.letter.findByPk(request.params.letterId, {
      include: [
        {
          model: models.letter_types,
          as: "letterType",
          include: ["letterTypeLetterImage"]
        }
      ]
    });

    if (letter == null) {
      throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
    }

    const d = new Date();
    let time = d.getTime();

    let filename = constructFilename(existingCase, letter.letterType.type);
    filename =
      filename.substring(0, filename.indexOf(".pdf")) + "_" + time + ".pdf";
    await models.sequelize.transaction(async transaction => {
      await generateLetter(existingCase.id, filename, letter);

      await createLetterAttachment(
        existingCase.id,
        filename,
        letter.letterType.type,
        transaction,
        request.nickname
      );

      await letter.update(
        { finalPdfFilename: filename, editStatus: request.body.editStatus },
        { auditUser: request.nickname, transaction }
      );

      await auditFileAction(
        request.nickname,
        existingCase.id,
        AUDIT_ACTION.UPLOADED,
        filename,
        AUDIT_FILE_TYPE.LETTER,
        transaction
      );
    });
    response.status(200).send({});
  }
);

const createLetterAttachment = async (
  caseId,
  fileName,
  description,
  transaction,
  nickname
) => {
  await models.attachment.create(
    {
      fileName: fileName,
      description: description,
      caseId: caseId
    },
    {
      transaction: transaction,
      auditUser: nickname
    }
  );
};

const generateLetter = async (caseId, filename, letter, transaction) => {
  const includeSignature = true;
  const { pdfBuffer } = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction,
    {
      getSignature: async args => {
        return await retrieveSignatureImageBySigner(args.sender);
      },
      letter
    }
  );

  const filenameWithCaseId = `${caseId}/${filename}`;

  await uploadLetterToS3(
    filenameWithCaseId,
    pdfBuffer,
    config[process.env.NODE_ENV].s3Bucket
  );
};

const getCase = async caseId => {
  return await Case.getCase(caseId, {
    include: [
      {
        model: models.caseStatus,
        as: "status"
      }
    ]
  });
};

export default updateLetterAndUploadToS3;
