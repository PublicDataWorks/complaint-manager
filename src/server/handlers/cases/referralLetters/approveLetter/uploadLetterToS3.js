import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";

const uploadLetterToS3 = (caseId, pdfOutput) => {
  const s3 = createConfiguredS3Instance();
  return s3
    .upload({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: constructFilename(caseId),
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

const constructFilename = caseId => {
  return `${caseId}/ReferralLetter_Case${caseId}.pdf`;
};

export default uploadLetterToS3;
