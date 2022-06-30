import Boom from "boom";
import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import createConfiguredS3Instance from "../../createConfiguredS3Instance";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

const addSigner = asyncMiddleware(async (request, response, next) => {
  const promises = Promise.all([
    checkIfSignatureFileExists(request.body.signatureFile),
    checkIfNicknameAlreadyHasASigner(request.body.nickname)
  ]);

  await promises;

  const signer = await models.signers.create(
    {
      name: request.body.name,
      title: request.body.title,
      nickname: request.body.nickname,
      phone: formatPhoneWithDashes(request.body.phone),
      signatureFile: request.body.signatureFile
    },
    { auditUser: request.nickname }
  );
  response.status(200).json(signer.toPayload(signer));
});

const checkIfSignatureFileExists = async fileName => {
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

const checkIfNicknameAlreadyHasASigner = async nickname => {
  const result = await models.signers.findAll({
    where: { nickname }
  });

  if (result.length) {
    throw Boom.badRequest("There is already a signature for this user");
  }
};

const formatPhoneWithDashes = phone => {
  if (!phone) {
    return;
  }

  let phoneString = phone.replace(/\D/gi, "");
  const areaCode = phoneString.substring(0, 3);
  const first = phoneString.substring(3, 6);
  const second = phoneString.substring(6, 10);

  return `${areaCode}-${first}-${second}`;
};

export default addSigner;
