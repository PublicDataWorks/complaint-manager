import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import models from "../../../policeDataManager/models";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

export const retrieveSignatureImage = async fileName => {
  const s3 = createConfiguredS3Instance();
  if (fileName) {
    const data = await new Promise((resolve, reject) => {
      s3.getObject(
        {
          Bucket: config[process.env.NODE_ENV].s3Bucket,
          Key: `signatures/${fileName}`
        },
        (err, response) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });

    return `<img style="max-height: 55px" src="data:${
      data.ContentType
    };base64,${data.Body.toString("base64")}" />`;
  } else {
    return "<p><br></p>";
  }
};

export const retrieveSignatureImageBySigner = async sender => {
  if (!sender) {
    return undefined;
  }

  const signer = await models.signers.findOne({
    where: { name: sender.split("\n")[0] },
    attributes: ["signatureFile"]
  });

  return signer
    ? await retrieveSignatureImage(signer.signatureFile)
    : "<p><br></p>";
};
