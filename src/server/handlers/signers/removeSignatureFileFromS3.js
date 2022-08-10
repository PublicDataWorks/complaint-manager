import createConfiguredS3Instance from "../../createConfiguredS3Instance";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const removeSignatureFileFromS3 = signatureFile => {
    createConfiguredS3Instance().deleteObject(
      {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `signatures/${signatureFile}`
      },
      (err, data) => {
        if (err) {
          console.err("Error while removing signature file from s3", err);
        }
      }
    );
  };

  export default removeSignatureFileFromS3;
