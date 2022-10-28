import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

const addLetterType = asyncMiddleware(async (request, response, next) => {
  const signer = await models.signers.findOne({
    where: { nickname: request.body.defaultSender },
    attributes: ["id", "name", "nickname", "phone", "signatureFile", "title"]
  });

  if (!signer) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_SENDER);
  }

  const status = await models.caseStatus.findOne({
    where: { name: request.body.requiredStatus },
    attributes: ["id", "name", "orderKey"]
  });

  if (!status) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
  }

  let newLetterType;
  try {
    newLetterType = await models.letter_types.create(
      {
        type: request.body.type,
        template: request.body.template,
        editableTemplate: request.body.editableTemplate,
        requiresApproval: request.body.requiresApproval,
        hasEditPage: request.body.hasEditPage,
        defaultSenderId: signer.id,
        requiredStatusId: status.id
      },
      { auditUser: request.nickname }
    );
  } catch (e) {
    if (e.parent?.constraint === "letter_types_type_key") {
      console.error(e);
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_TYPE);
    } else {
      throw e;
    }
  }

  const letterType = await models.letter_types.findByPk(newLetterType.id, {
    include: ["defaultSender", "requiredStatus"]
  });

  response.status(200).send(letterType.toPayload(letterType));
});

export default addLetterType;
