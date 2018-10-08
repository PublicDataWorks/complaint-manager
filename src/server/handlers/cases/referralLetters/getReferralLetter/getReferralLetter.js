import getLetterDataForResponse from "../getLetterDataForResponse";
import asyncMiddleware from "../../../asyncMiddleware";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import Boom from "boom";
import models from "../../../../models/index";

const getReferralLetter = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const validStatuses = [
    CASE_STATUS.LETTER_IN_PROGRESS,
    CASE_STATUS.READY_FOR_REVIEW
  ];
  const existingCase = await models.cases.findById(caseId);

  if (!validStatuses.includes(existingCase.status)) {
    throw Boom.badRequest("Invalid case status.");
  }

  const transformedLetterData = await getLetterDataForResponse(caseId);
  response.send(transformedLetterData);
});

module.exports = getReferralLetter;
