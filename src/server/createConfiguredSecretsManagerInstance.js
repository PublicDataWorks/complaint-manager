const AWS = require("aws-sdk");
const path = require("path");

const createConfiguredSecretsManagerInstance = () => {
  const secretsManager = new AWS.SecretsManager({
    region: "us-east-2"
  });

  secretsManager.config.loadFromPath(path.join(__dirname, "./awsConfig.json"));

  return secretsManager;
};
module.exports = createConfiguredSecretsManagerInstance;
