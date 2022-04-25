import createConfiguredS3Instance from "../../../createConfiguredS3Instance";
import models from "../../../policeDataManager/models";

export const retrieveSignatureImage = async sender => {
  const s3 = createConfiguredS3Instance();
  let fileName = await getFileNameBySigner(sender);
  if (fileName) {
    const data = await new Promise((resolve, reject) => {
      s3.getObject(
        { Bucket: "noipm-local", Key: `signatures/${fileName}` },
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

const getFileNameBySigner = async sender => {
  if (!sender) {
    return undefined;
  }

  const signer = await models.signers.findOne({
    where: { name: sender.split("\n")[0] }
  });
  return signer ? signer.signatureFile : undefined;
};
