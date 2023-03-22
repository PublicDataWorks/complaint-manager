import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  USER_PERMISSIONS
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

const generateLetterAndUploadToS3 = asyncMiddleware(
  async (request, response, next) => {
    validateUserPermissions(request);

    const caseId = request.params.caseId;
    const existingCase = await getCase(caseId);
    const d = new Date();
    let time = d.getTime();

    const letter = await models.sequelize.transaction(async transaction => {
      const letterType = await models.letter_types.findOne({
        where: { type: request.body.type },
        include: [
          {
            model: models.signers,
            as: "defaultSender"
          }
        ],
        transaction
      });

      let filename;
      if (letterType.hasEditPage) {
        filename = constructFilename(existingCase, request.body.type, "");
        filename =
          filename.substring(0, filename.indexOf(".pdf")) + "_" + time + ".pdf";
      } else {
        filename = await generateAttachedLetter(
          existingCase,
          request,
          transaction,
          time
        );
      }

      return await models.letter.create(
        {
          caseId,
          typeId: letterType.id,
          finalPdfFilename: filename,
          recipient: letterType.defaultRecipient,
          recipientAddress: letterType.defaultRecipientAddress,
          sender: letterType.defaultSender
            ? `${letterType.defaultSender.name}\n${letterType.defaultSender.title}\n${letterType.defaultSender.phone}`
            : null
        },
        { transaction, auditUser: request.nickname }
      );
    });
    response.status(200).send({ id: letter.id });
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
      type: request.body.type
    }
  );

  const filenameWithCaseId = `${caseId}/${filename}`;

  await uploadLetterToS3(
    filenameWithCaseId,
    pdfBuffer,
    config[process.env.NODE_ENV].s3Bucket
  );
};

const validateUserPermissions = request => {
  if (
    !request.permissions.includes(USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES)
  ) {
    throw Boom.badRequest(
      BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_APPROVE_LETTER
    );
  }
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

const generateAttachedLetter = async (
  existingCase,
  request,
  transaction,
  time
) => {
  let filename = constructFilename(existingCase, request.body.type);
  filename =
    filename.substring(0, filename.indexOf(".pdf")) + "_" + time + ".pdf";
  await generateLetter(existingCase.id, filename, request);

  await createLetterAttachment(
    existingCase.id,
    filename,
    request.body.type,
    transaction,
    request.nickname
  );

  await auditFileAction(
    request.nickname,
    existingCase.id,
    AUDIT_ACTION.UPLOADED,
    filename,
    AUDIT_FILE_TYPE.LETTER,
    transaction
  );
  return filename;
};

export default generateLetterAndUploadToS3;
