import Boom from "boom";
import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
import { checkIfSignatureFileExists, formatPhoneWithDashes } from "./utils";
import removeSignatureFileFromS3 from "./removeSignatureFileFromS3";

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

export default editSigner;
