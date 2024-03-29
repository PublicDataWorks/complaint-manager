import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../../sharedUtilities/constants";
import { retrieveSignatureImageBySigner } from "../referralLetters/retrieveSignatureImage";
import uploadLetterToS3 from "../referralLetters/sharedLetterUtilities/uploadLetterToS3";
import constructFilename from "../referralLetters/constructFilename";
import { auditFileAction } from "../../audits/auditFileAction";
import generateLetterPdfBuffer from "../referralLetters/generateLetterPdfBuffer";
import Case from "../../../policeDataManager/payloadObjects/Case";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const generateLetterAndUploadToS3 = asyncMiddleware(
  async (request, response, next) => {
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

      let recipient = letterType.defaultRecipient;
      if (recipient === "{primaryComplainant}") {
        if (existingCase.primaryComplainant) {
          recipient = existingCase.primaryComplainant.inmate
            ? existingCase.primaryComplainant.inmate.fullName
            : existingCase.primaryComplainant.fullName;
        } else {
          recipient = null;
        }
      }

      let recipientAddress = letterType.defaultRecipientAddress;
      if (recipientAddress === "{primaryComplainantAddress}") {
        if (existingCase.primaryComplainant?.inmate?.facilityDetails?.address) {
          recipientAddress = `${existingCase.primaryComplainant?.inmate?.facilityDetails?.name}\n${existingCase.primaryComplainant?.inmate?.facilityDetails?.address}`;
        } else if (existingCase?.primaryComplainant?.facility) {
          const facility = await models.facility.findOne({
            where: { name: existingCase.primaryComplainant.facility },
            attributes: ["address"]
          });
          if (facility?.address) {
            recipientAddress = `${existingCase.primaryComplainant.facility}\n${facility.address}`;
          } else {
            recipientAddress = null;
          }
        } else if (existingCase.primaryComplainant?.address) {
          const { streetAddress, streetAddress2, city, state, zipCode } =
            existingCase.primaryComplainant.address;
          recipientAddress = `${streetAddress}\n${
            streetAddress2 ? `${streetAddress2}\n` : ""
          }${city}, ${state} ${zipCode}`;
        } else {
          recipientAddress = null;
        }
      }

      let letter = await models.letter.create(
        {
          caseId,
          typeId: letterType.id,
          recipient,
          recipientAddress,
          sender: letterType.defaultSender
            ? `${letterType.defaultSender.name}\n${letterType.defaultSender.title}\n${letterType.defaultSender.phone}`
            : null
        },
        { transaction, auditUser: request.nickname }
      );

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
          time,
          letter
        );
      }

      return await letter.update(
        { finalPdfFilename: filename },
        { auditUser: request.nickname, transaction }
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

const generateLetter = async (
  caseId,
  filename,
  request,
  letter,
  transaction
) => {
  const includeSignature = true;
  const { pdfBuffer } = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction,
    {
      getSignature: async args => {
        return await retrieveSignatureImageBySigner(args.sender);
      },
      type: request.body.type,
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
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: ["address"]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.caseInmate,
        as: "complainantInmates",
        include: [
          {
            model: models.inmate,
            as: "inmate",
            include: ["facilityDetails"]
          }
        ]
      }
    ]
  });
};

const generateAttachedLetter = async (
  existingCase,
  request,
  transaction,
  time,
  letter
) => {
  let filename = constructFilename(existingCase, request.body.type);
  filename =
    filename.substring(0, filename.indexOf(".pdf")) + "_" + time + ".pdf";
  await generateLetter(existingCase.id, filename, request, letter, transaction);

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
