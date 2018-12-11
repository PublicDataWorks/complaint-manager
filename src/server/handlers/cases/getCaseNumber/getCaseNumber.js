import asyncMiddleware from "../../asyncMiddleware";
import models from "../../../models";

const getCaseNumber = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.id;
  const caseNumber = await models.sequelize.transaction(async transaction => {
    const singleCase = await models.cases.findById(caseId, {
      transaction: transaction
    });

    return singleCase.caseNumber;
  });

  response.status(200).send({ caseNumber: caseNumber });
});

export default getCaseNumber;
