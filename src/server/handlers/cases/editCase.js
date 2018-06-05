const moment = require("moment");
const models = require("../../models");
const asyncMiddleware = require("../asyncMiddleware");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

async function upsertAddress(caseId, incidentLocation, transaction, nickname) {
  if (!incidentLocation.id) {
    const createdAddress = await models.address.create(
      {
        ...incidentLocation,
        addressableType: "cases",
        addressableId: caseId
      },
      {
        transaction
      }
    );
  } else {
    await models.address.update(incidentLocation, {
      where: { id: incidentLocation.id },
      transaction
    });
  }
}

const editCase = asyncMiddleware(async (request, response, next) => {
  if (
    !request.body.firstContactDate ||
    !moment(request.body.firstContactDate).isValid()
  ) {
    response.status(400).json({ error: "firstContactDate is required" });
  } else {
    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const { incidentLocation, ...caseValues } = request.body;

        if (incidentLocation) {
          await upsertAddress(
            request.params.id,
            incidentLocation,
            transaction,
            request.nickname
          );
        }

        await models.cases.update(caseValues, {
          where: { id: request.params.id },
          individualHooks: true,
          transaction,
          auditUser: request.nickname
        });

        return await getCaseWithAllAssociations(request.params.id, transaction);
      }
    );
    response.status(200).send(updatedCase);
  }
});

module.exports = editCase;
