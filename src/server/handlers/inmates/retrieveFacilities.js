import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";

const retrieveFacilities = asyncMiddleware(async (request, response, next) => {
  const facilities = await models.sequelize.transaction(async transaction => {
    const facilities = await models.facility.findAll({ transaction });

    const auditDetails = getQueryAuditAccessDetails(
      { transaction },
      models.facility.name
    );

    await auditDataAccess(
      request.nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.FACILITIES,
      auditDetails,
      transaction
    );

    return facilities;
  });

  response.send(facilities);
});

export default retrieveFacilities;
