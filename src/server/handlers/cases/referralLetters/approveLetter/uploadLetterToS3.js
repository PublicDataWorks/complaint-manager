import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";
import moment from "moment";

const uploadLetterToS3 = (
  caseId,
  caseNumber,
  firstContactDate,
  firstComplainantLastName,
  pdfOutput
) => {
  const s3 = createConfiguredS3Instance();
  const formattedFirstContactDate = moment(firstContactDate).format(
    "MM/DD/YYYY"
  );
  const strippedLastName = firstComplainantLastName.replace(/[^a-zA-Z]/g, "");
  return s3
    .upload({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: constructFilename(
        caseId,
        caseNumber,
        formattedFirstContactDate,
        strippedLastName
      ),
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

const constructFilename = (
  caseId,
  caseNumber,
  firstContactDate,
  complainantLastName
) => {
  return `${caseId}/${firstContactDate}_${caseNumber}_PIB_Referral_${complainantLastName}.pdf`;
};

export default uploadLetterToS3;
