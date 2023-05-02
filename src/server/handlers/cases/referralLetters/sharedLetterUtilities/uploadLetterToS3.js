import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";

const uploadLetterToS3 = (filename, pdfOutput, bucketName) => {
  const s3 = createConfiguredS3Instance();
  return s3.putObject({
    Bucket: bucketName,
    Key: filename,
    Body: pdfOutput,
    ServerSideEncryption: "AES256"
  });
};

export default uploadLetterToS3;
