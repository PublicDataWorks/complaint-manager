import models from "../../../policeDataManager/models";
import asyncMiddleware from "../../asyncMiddleware";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const editLetterContent = asyncMiddleware(async (request, response, next) => {
  const letter = await models.letter.findByPk(request.params.letterId);

  // Add validation in case the letterId is not on the case ?
  // Update the test from caseId to letterId
  if (letter == null) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.LETTER_DOES_NOT_EXIST);
  }
  await letter.update(
    {
      editedLetterHtml: request.body.editedLetterHtml
    },
    {
      auditUser: request.nickname
    }
  );

  return response.status(200).send({});
});

export default editLetterContent;
