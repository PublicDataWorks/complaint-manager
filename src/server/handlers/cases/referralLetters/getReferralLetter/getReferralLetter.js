import getLetterDataForResponse from "../getLetterDataForResponse";
import asyncMiddleware from "../../../asyncMiddleware";
import checkForValidStatus from "../checkForValidStatus";

const getReferralLetter = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  await checkForValidStatus(caseId);

  const transformedLetterData = await getLetterDataForResponse(caseId);
  response.send(transformedLetterData);
});

module.exports = getReferralLetter;
