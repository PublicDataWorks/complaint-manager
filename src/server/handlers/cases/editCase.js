const moment = require("moment");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

async function upsertAddress(
  caseId,
  incidentLocationId,
  incidentLocation,
  transaction,
  nickname
) {
  if (!incidentLocationId) {
    const createdAddress = await models.address.create(
      {
        ...incidentLocation
      },
      {
        transaction
      }
    );

    await models.cases.update(
      {
        incidentLocationId: createdAddress.id
      },
      {
        where: { id: caseId },
        transaction,
        auditUser: nickname
      }
    );
  } else {
    await models.address.update(incidentLocation, {
      where: { id: incidentLocationId },
      transaction
    });
  }
}

const editCase = async (request, response, next) => {
  try {
    if (
      !request.body.firstContactDate ||
      !moment(request.body.firstContactDate).isValid()
    ) {
      response.status(400).json({ error: "firstContactDate is required" });
    } else {
      const updatedCase = await models.sequelize.transaction(
        async transaction => {
          const {
            incidentLocationId,
            incidentLocation,
            ...caseValues
          } = request.body;

          if (incidentLocation) {
            await upsertAddress(
              request.params.id,
              incidentLocationId,
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

          await models.audit_log.create(
            {
              action: "Incident details updated",
              caseId: request.params.id,
              user: request.nickname
            },
            {
              transaction
            }
          );

          return await getCaseWithAllAssociations(
            request.params.id,
            transaction
          );
        }
      );
      response.status(200).send(updatedCase);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = editCase;
