const set = require("lodash/set");
const AWS = require("aws-sdk");
const path = require("path");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const createConfiguredS3Instance = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const isLowerEnv = ["development", "test"].includes(process.env.NODE_ENV);
  const areCloudServicesDisabled = process.env.REACT_APP_USE_CLOUD_SERVICES == "false";

  let credentials = { accessKeyId, secretAccessKey };

  if (isLowerEnv && areCloudServicesDisabled) {
    console.log("Overriding AWS config for Localstack");
    credentials = { accessKeyId: "test", secretAccessKey: "test" };
    const localConfig = {
      endpoint: "host.docker.internal:4566",
      s3ForcePathStyle: true,
      sslEnabled: false
    };
    set(AWS, ["config", "s3"], localConfig);
  }

  const s3 = new AWS.S3(credentials);

  s3.config.update(config.s3config);

  return s3;
};

module.exports = createConfiguredS3Instance;
