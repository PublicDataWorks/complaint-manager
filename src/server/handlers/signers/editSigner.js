import Boom from "boom";
import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import createConfiguredS3Instance from "../../createConfiguredS3Instance";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
import { checkIfSignatureFileExists, formatPhoneWithDashes } from "./utils";

const editSigner = asyncMiddleware(async (request, response, next) => {
  if (request.body.signatureFile) {
    await checkIfSignatureFileExists(request.body.signatureFile);
  }

  const signer = await models.signers.findByPk(request.params.id);
  if (!signer) {
    throw Boom.notFound("The requested resource was not found");
  }

  signer.name = request.body.name;
  signer.title = request.body.title;
  signer.phone = formatPhoneWithDashes(request.body.phone);

  if (
    request.body.signatureFile &&
    request.body.signatureFile !== signer.signatureFile
  ) {
    removeSignatureFileFromS3(signer.signatureFile);
    signer.signatureFile = request.body.signatureFile;
  }

  await signer.save();

  response.status(200).json(signer.toPayload(signer));
});

const removeSignatureFileFromS3 = signatureFile => {
  createConfiguredS3Instance().deleteObject(
    {
      Bucket: config[process.env.NODE_ENV].s3Bucket,
      Key: `signatures/${signatureFile}`
    },
    (err, data) => {
      if (err) {
        console.err("Error while removing signature file from s3", err);
      }
    }
  );
};

export default editSigner;
