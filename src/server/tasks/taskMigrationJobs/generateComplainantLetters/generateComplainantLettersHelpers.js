import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import generateComplainantLetterPdfBuffer from "../../../handlers/cases/referralLetters/complainantLetter/generateComplainantLetterPdfBuffer";
import uploadLetterToS3 from "../../../handlers/cases/referralLetters/sharedLetterUtilities/uploadLetterToS3";
import models from "../../../models";

const config = require("../../../config/config");

export const complainantLetterExistsInAws = async complainantLetter => {
  const caseId = complainantLetter.caseId;
  const finalPdfFilename = complainantLetter.finalPdfFilename;
  const s3 = createConfiguredS3Instance();

  const bucket = config[process.env.NODE_ENV].complainantLettersBucket;
  const key = `${caseId}/${finalPdfFilename}`;

  const params = {
    Bucket: bucket,
    Key: key
  };

  let result = undefined;
  try {
    await s3.headObject(params).promise();
    result = true;
  } catch (headErr) {
    if (headErr.code === "NotFound") {
      result = false;
    } else {
      result = null;
    }
  }

  return result;
};

export const uploadComplainantLetterToS3ForMigration = async complainantLetter => {
  let primaryComplainant;

  const existingCase = await models.cases.findByPk(complainantLetter.caseId, {
    paranoid: false
  });

  if (complainantLetter.complainantCivilian) {
    primaryComplainant = complainantLetter.complainantCivilian;
  } else {
    primaryComplainant = complainantLetter.caseOfficers;
  }

  const pdfBuffer = await generateComplainantLetterPdfBuffer(
    existingCase,
    primaryComplainant
  );

  const fullFilenameWithKey = `${complainantLetter.caseId}/${
    complainantLetter.finalPdfFilename
  }`;
  await uploadLetterToS3(
    fullFilenameWithKey,
    pdfBuffer,
    config[process.env.NODE_ENV].complainantLettersBucket
  );

  const wasComplainantLetterUploadedSuccessfully = await complainantLetterExistsInAws(
    complainantLetter
  );
  if (!wasComplainantLetterUploadedSuccessfully) {
    throw new Error(
      `The complainant letter for case id (${
        complainantLetter.caseId
      }) was not uploaded`
    );
  }
};
