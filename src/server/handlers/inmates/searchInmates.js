import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import {
  ASCENDING,
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import { Op } from "sequelize";

const searchInmates = asyncMiddleware(async (request, response, next) => {
  const whereClause = {};

  if (request.query.firstName) {
    whereClause.first_name = { [Op.iLike]: `${request.query.firstName}%` };
  }
  if (request.query.lastName) {
    whereClause.last_name = { [Op.iLike]: `${request.query.lastName}%` };
  }
  if (request.query.inmateId) {
    whereClause.inmateId = { [Op.iLike]: `%${request.query.inmateId}%` };
  }
  // if (request.query.districtId) {
  //   whereClause.district_id = { [Op.eq]: `${request.query.districtId}` };
  // }

  const offset = request.query.page
    ? (request.query.page - 1) * DEFAULT_PAGINATION_LIMIT
    : null;

  const inmates = await models.sequelize.transaction(async transaction => {
    const queryOptions = {
      where: whereClause,
      order: [
        ["last_name", ASCENDING],
        ["first_name", ASCENDING]
      ],
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: offset,
      transaction
    };

    const inmates = await models.inmate.findAndCountAll(queryOptions);

    const auditDetails = getQueryAuditAccessDetails(
      queryOptions,
      models.inmate.name
    );

    await auditDataAccess(
      request.nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.INMATE_DATA,
      auditDetails,
      transaction
    );

    return inmates;
  });

  response.send(inmates);
});

export default searchInmates;
