import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";

const uploadLetterToS3 = (filename, pdfOutput, bucketName) => {
  const s3 = createConfiguredS3Instance();
  return s3
    .upload({
      Bucket: bucketName,
      Key: filename,
      Body: pdfOutput,
      ServerSideEncryption: "AES256"
    })
    .promise();
};

export default uploadLetterToS3;
