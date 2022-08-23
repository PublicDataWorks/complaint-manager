import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { mapSignerToPayload } from "../../policeDataManager/models/modelUtilities/signerHelpers";
import {
  checkIfNicknameAlreadyHasASigner,
  checkIfSignatureFileExists,
  formatPhoneWithDashes
} from "./utils";

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
  const payload = await mapSignerToPayload(signer);
  response.status(200).json(payload);
});

export default addSigner;
