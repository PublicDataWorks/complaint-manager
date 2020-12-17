const set = require("lodash/set");
const AWS = require("aws-sdk");
const path = require("path");

const createConfiguredSecretsManagerInstance = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const isLowerEnv = ["development", "test"].includes(process.env.NODE_ENV);
  const areCloudServicesDisabled =
    process.env.CLOUD_SERVICES_DISABLED == "true";

  let credentials = { accessKeyId, secretAccessKey };
  if (isLowerEnv && areCloudServicesDisabled) {
    console.log("Overriding AWS config for Localstack");
    credentials = { accessKeyId: "test", secretAccessKey: "test" };
    const localConfig = {
      endpoint: "host.docker.internal:4566"
    };
    set(AWS, ["config", "secretsmanager"], localConfig);
  }

  AWS.config.update({ region: "us-east-1" });
  const secretsManager = new AWS.SecretsManager(credentials);

  return secretsManager;
};
module.exports = createConfiguredSecretsManagerInstance;
