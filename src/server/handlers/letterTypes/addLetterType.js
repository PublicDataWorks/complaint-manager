import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const addLetterType = asyncMiddleware(async (request, response, next) => {
  let signer, status, newLetterType, letterType;

  signer = await models.signers.findOne({
    where: { nickname: request.body.defaultSender },
    attributes: ["id", "name", "nickname", "phone", "signatureFile", "title"]
  });

  status = await models.caseStatus.findOne({
    where: { name: request.body.requiredStatus },
    attributes: ["id", "name", "orderKey"]
  });

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

  letterType = newLetterType.toJSON();
  letterType.defaultSender = signer;
  letterType.requiredStatus = status.name;

  response.status(200).send(letterType);
});

export default addLetterType;
