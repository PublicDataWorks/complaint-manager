import Boom from "boom";
import { NOT_FOUND_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import models from "../../../policeDataManager/models";
import asyncMiddleware from "../../asyncMiddleware";

const editLetterAddresses = asyncMiddleware(async (request, response, next) => {
  let letter = await models.letter.findByPk(request.params.letterId);

  if (!letter || letter.caseId !== request.params.caseId) {
    throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  }

  letter = await letter.update(
    {
      recipient: request.body.recipient,
      recipientAddress: request.body.recipientAddress,
      sender: request.body.sender,
      transcribedBy: request.body.transcribedBy
    },
    { auditUser: request.nickname }
  );

  return response.status(200).send(letter);
});

export default editLetterAddresses;
