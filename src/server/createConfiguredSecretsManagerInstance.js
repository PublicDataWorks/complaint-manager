const set = require("lodash/set");
const AWS = require("aws-sdk");
const path = require("path");

const createConfiguredSecretsManagerInstance = () => {
  const isLowerEnv = ["development", "test"].includes(process.env.NODE_ENV);
  const areCloudServicesDisabled =
    process.env.REACT_APP_USE_CLOUD_SERVICES == "false";

  if (isLowerEnv && areCloudServicesDisabled) {
    const localConfig = {
      endpoint: "host.docker.internal:4566"
    };
    set(AWS, ["config", "secretsmanager"], localConfig);
  }

  const secretsManager = new AWS.SecretsManager({
    region: "us-east-1"
  });
  return secretsManager;
};
module.exports = createConfiguredSecretsManagerInstance;
