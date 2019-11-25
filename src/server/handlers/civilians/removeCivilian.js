import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../complaintManager/models");
const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");

const removeCivilian = asyncMiddleware(async (request, response, next) => {
  const caseDetails = await models.sequelize.transaction(async transaction => {
    const civilian = await models.civilian.findByPk(request.params.civilianId, {
      include: [
        {
          model: models.address
        }
      ],
      transaction: transaction
    });

    if (civilian.address) {
      await models.address.destroy({
        where: { id: civilian.dataValues.address.id },
        transaction: transaction,
        auditUser: request.nickname
      });
    }

    await models.civilian.destroy({
      where: { id: request.params.civilianId },
      transaction: transaction,
      auditUser: request.nickname
    });

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      civilian.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );

    return caseDetails;
  });

  response.status(200).send(caseDetails);
});

module.exports = removeCivilian;
