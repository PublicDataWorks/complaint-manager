import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import Boom from "boom";

const retrieveFacilities = asyncMiddleware(async (request, response, next) => {
  const expand = request.query.expand;
  if (expand && expand !== "housingUnits") {
    throw Boom.badRequest("Invalid expand parameter");
  }
  const facilities = await models.sequelize.transaction(async transaction => {
    const facilities = await models.facility.findAll({ transaction, include: expand ? [expand]: undefined});

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
