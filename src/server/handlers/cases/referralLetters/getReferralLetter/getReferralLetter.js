import getLetterDataForResponse from "../getLetterDataForResponse";
import asyncMiddleware from "../../../asyncMiddleware";

const getReferralLetter = asyncMiddleware(async (request, response) => {
  const transformedLetterData = await getLetterDataForResponse(
    request.params.caseId
  );
  response.send(transformedLetterData);
});

module.exports = getReferralLetter;
