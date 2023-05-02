const {
  SecretsManager,
  GetSecretValueCommand
} = require("@aws-sdk/client-secrets-manager");

const createConfiguredSecretsManagerInstance = () => {
  const isLowerEnv = ["development", "test"].includes(process.env.NODE_ENV);
  const areCloudServicesDisabled =
    process.env.REACT_APP_USE_CLOUD_SERVICES == "false";

  let settings = {
    region: "us-east-1"
  };
  if (isLowerEnv && areCloudServicesDisabled) {
    const settings = {
      ...settings,
      endpoint: "http://host.docker.internal:4566",
      credentials: { accessKeyId: "test", secretAccessKey: "test" },
      tls: false
    };
  } else {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    settings = {
      ...settings,
      credentials: { accessKeyId, secretAccessKey },
      tls: true
    };
  }

  const secretsManager = new SecretsManager(settings);
  return {
    getSecretValue: async ({ SecretId }) =>
      secretsManager.send(new GetSecretValueCommand({ SecretId }))
  };
};
module.exports = createConfiguredSecretsManagerInstance;
