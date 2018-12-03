import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";

const uploadLetterToS3 = (caseId, caseNumber, pdfOutput) => {
  const s3 = createConfiguredS3Instance();
  return s3
    .upload({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: constructFilename(caseId, caseNumber),
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

const constructFilename = (caseId, caseNumber) => {
  return `${caseId}/ReferralLetter_${caseNumber}.pdf`;
};

export default uploadLetterToS3;
