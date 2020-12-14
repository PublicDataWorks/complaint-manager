const AWS = require("aws-sdk");
const path = require("path");

const createConfiguredSecretsManagerInstance = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const areCloudServicesDisabled = process.env.CLOUD_SERVICES_DISABLED == "true";
  
  let credentials = { accessKeyId, secretAccessKey };

  if (process.env.NODE_ENV === "development" && areCloudServicesDisabled) {
    credentials = { accessKeyId: "test", secretAccessKey: "test" };
    AWS.config.secretsManager = { endpoint: 'host.docker.internal:4566', s3ForcePathStyle: true };
  }
  
  const secretsManager = new AWS.SecretsManager(credentials);
  
  return secretsManager;
};
module.exports = createConfiguredSecretsManagerInstance;
