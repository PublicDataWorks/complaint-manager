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
  if (process.env.OFFICER_ROSTER_LATEST_DATE) {
    const date = getYearMonthDayFromEpoch(
      process.env.OFFICER_ROSTER_LATEST_DATE
    );

    if (date instanceof Error) {
      throw date;
    } else {
      whereClause.created_at = {
        [Op.gte]: date
      };
    }
  }

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

const getYearMonthDayFromEpoch = epoch => {
  try {
    const date = new Date(0);
    date.setUTCSeconds(epoch);
    return date.toISOString().substring(0, 10);
  } catch (error) {
    console.error(error);
    return error;
  }
};
