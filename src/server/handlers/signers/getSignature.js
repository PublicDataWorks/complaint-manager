import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import { retrieveSignatureImage } from "../cases/referralLetters/retrieveSignatureImage";
import Boom from "boom";

const NOT_FOUND_MESSAGE = "The requested resource was not found";

const getSignature = asyncMiddleware(async (request, response, next) => {
  const queryOptions = {
    attributes: ["signatureFile"]
  };
  const signer = await models.signers.findByPk(request.params.id, queryOptions);
  if (!signer) {
    throw Boom.notFound(NOT_FOUND_MESSAGE);
  }

  auditDataAccess(
    request.nickname,
    null,
    MANAGER_TYPE.COMPLAINT,
    AUDIT_SUBJECT.SIGNERS,
    getQueryAuditAccessDetails(queryOptions, models.signers.name),
    null
  );

  const image = await retrieveSignatureImage(signer.signatureFile, false);
  console.log(image);
  if (!image) {
    throw Boom.notFound(NOT_FOUND_MESSAGE);
  }

  response.writeHead(200, {
    "Content-Type": image.ContentType,
    "Content-Length": image.Body.length
  });

  response.end(image.Body.toString("base64"));
});

export default getSignature;
