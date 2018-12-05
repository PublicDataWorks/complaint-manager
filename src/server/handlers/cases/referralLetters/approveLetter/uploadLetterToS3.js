import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import config from "../../../../config/config";

const uploadLetterToS3 = (filename, pdfOutput) => {
  const s3 = createConfiguredS3Instance();
  return s3
    .upload({
      Bucket: config[process.env.NODE_ENV].referralLettersBucket,
      Key: filename,
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

export default uploadLetterToS3;
