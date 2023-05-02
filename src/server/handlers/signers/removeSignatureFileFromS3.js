import createConfiguredS3Instance from "../../createConfiguredS3Instance";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const removeSignatureFileFromS3 = async signatureFile => {
  try {
    return await createConfiguredS3Instance().deleteObject({
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `signatures/${signatureFile}`
    });
  } catch (err) {
    console.error("Error while removing signature file from s3", err);
    throw err;
  }
};

export default removeSignatureFileFromS3;
