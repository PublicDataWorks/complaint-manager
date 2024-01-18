import { ASCENDING, AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../audits/auditDataAccess";

const models = require("../../../policeDataManager/models/index");
const {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const Op = require("sequelize").Op;

const searchOfficers = asyncMiddleware(async (request, response, next) => {
  const whereClause = {};

  if (request.query.firstName) {
    whereClause.first_name = { [Op.iLike]: `${request.query.firstName}%` };
  }
  if (request.query.lastName) {
    whereClause.last_name = { [Op.iLike]: `${request.query.lastName}%` };
  }
  if (request.query.districtId) {
    whereClause.district_id = { [Op.eq]: `${request.query.districtId}` };
  }
  console.log(`OFFICER ROASTER DATE ===>  ${process.env.OFFICER_ROASTER_LATEST_DATE}`)
  // if (process.env.OFFICER_ROASTER_LATEST_DATE) {
  whereClause.created_at = { [Op.gte]: `to_timestamp('1705602989')` };
  // }
  
  console.log("WHERE CLAUSE ==> ", whereClause);
  
  const offset = request.query.page
    ? (request.query.page - 1) * DEFAULT_PAGINATION_LIMIT
    : null;

  const officers = await models.sequelize.transaction(async transaction => {
    const queryOptions = {
      where: whereClause,
      order: [
        ["last_name", ASCENDING],
        ["first_name", ASCENDING]
      ],
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: offset,
      include: [
        {
          model: models.district,
          as: "officerDistrict"
        }
      ],
      transaction
    };

    const officers = await models.officer.findAndCountAll(queryOptions);

    const auditDetails = getQueryAuditAccessDetails(
      queryOptions,
      models.officer.name
    );

    await auditDataAccess(
      request.nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.OFFICER_DATA,
      auditDetails,
      transaction
    );

    return officers;
  });

  response.send(officers);
});

module.exports = searchOfficers;
