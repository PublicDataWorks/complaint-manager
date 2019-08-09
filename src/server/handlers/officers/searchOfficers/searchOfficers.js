import { ASCENDING, AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../audits/auditDataAccess";

const models = require("../../../models/index");
const {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT
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

  const offset = request.query.page
    ? (request.query.page - 1) * DEFAULT_PAGINATION_LIMIT
    : null;

  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const officers = await models.sequelize.transaction(async transaction => {
    const queryOptions = {
      where: whereClause,
      order: [["last_name", ASCENDING], ["first_name", ASCENDING]],
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

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        null,
        AUDIT_SUBJECT.OFFICER_DATA,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        undefined,
        AUDIT_SUBJECT.OFFICER_DATA,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return officers;
  });

  response.send(officers);
});

module.exports = searchOfficers;
