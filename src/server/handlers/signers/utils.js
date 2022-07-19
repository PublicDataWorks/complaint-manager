import Boom from "boom";
import models from "../../policeDataManager/models";
import createConfiguredS3Instance from "../../createConfiguredS3Instance";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

export const checkIfSignatureFileExists = async fileName => {
  const s3 = createConfiguredS3Instance();
  const signatureFiles = await new Promise((resolve, reject) =>
    s3.listObjectsV2(
      {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Prefix: "signatures/"
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    )
  );

  if (
    !signatureFiles.Contents.find(file => file.Key === `signatures/${fileName}`)
  ) {
    throw Boom.badRequest("The request cannot be completed");
  }
};

export const checkIfNicknameAlreadyHasASigner = async nickname => {
  const result = await models.signers.findAll({
    where: { nickname }
  });

  if (result.length) {
    throw Boom.badRequest("There is already a signature for this user");
  }
};

export const formatPhoneWithDashes = phone => {
  if (!phone) {
    return;
  }

  let phoneString = phone.replace(/\D/gi, "");
  const areaCode = phoneString.substring(0, 3);
  const first = phoneString.substring(3, 6);
  const second = phoneString.substring(6, 10);

  return `${areaCode}-${first}-${second}`;
};
