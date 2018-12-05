import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";
import constructFilename from "../constructFilename";
import { REFERRAL_LETTER_VERSION } from "../../../../../sharedUtilities/constants";

const uploadLetterToS3 = (
  caseId,
  caseNumber,
  firstContactDate,
  firstComplainantLastName,
  pdfOutput
) => {
  const s3 = createConfiguredS3Instance();
  return s3
    .upload({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: constructFilename(
        caseId,
        caseNumber,
        firstContactDate,
        firstComplainantLastName,
        REFERRAL_LETTER_VERSION.FINAL
      ),
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

export default uploadLetterToS3;
