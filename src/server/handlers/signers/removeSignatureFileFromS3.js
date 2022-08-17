import createConfiguredS3Instance from "../../createConfiguredS3Instance";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const removeSignatureFileFromS3 = signatureFile => {
  return new Promise((resolve, reject) =>
    createConfiguredS3Instance().deleteObject(
      {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `signatures/${signatureFile}`
      },
      (err, data) => {
        if (err) {
          console.error("Error while removing signature file from s3", err);
          reject(err);
        } else {
          resolve(data);
        }
      }
    )
  );
};

export default removeSignatureFileFromS3;
