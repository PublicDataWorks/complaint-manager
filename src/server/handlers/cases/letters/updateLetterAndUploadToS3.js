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
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { auditFileAction } from "../../audits/auditFileAction";
import generateLetterPdfBuffer from "../referralLetters/generateLetterPdfBuffer";
import Case from "../../../policeDataManager/payloadObjects/Case";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const updateLetterAndUploadToS3 = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    const existingCase = await getCase(caseId);
    const d = new Date();
    let time = d.getTime();

    let filename = constructFilename(
      existingCase,
      request.body.letter.letterType.type
    );
    filename =
      filename.substring(0, filename.indexOf(".pdf")) + "_" + time + ".pdf";
    console.log(filename);
    await models.sequelize.transaction(async transaction => {
      await generateLetter(existingCase.id, filename, request);

      await createLetterAttachment(
        existingCase.id,
        filename,
        request.body.letter.letterType.type,
        transaction,
        request.nickname
      );

      const letter = await models.letter.findByPk(request.params.letterId);

      if (letter == null) {
        throw Boom.badRequest(BAD_REQUEST_ERRORS.LETTER_DOES_NOT_EXIST);
      }

      await letter.update(
        { finalPdfFilename: filename },
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

const generateLetter = async (caseId, filename, request, transaction) => {
  const includeSignature = true;
  const { pdfBuffer } = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction,
    {
      getSignature: async args => {
        return await retrieveSignatureImageBySigner(args.sender);
      },
      type: request.body.letter.letterType.type
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
