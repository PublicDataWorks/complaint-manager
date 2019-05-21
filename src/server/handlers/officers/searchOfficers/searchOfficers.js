import { ASCENDING, AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import { generateAndAddAuditDetailsFromQuery } from "../../getQueryAuditAccessDetails";

const models = require("../../../models/index");
const {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const Op = require("sequelize").Op;
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const searchOfficers = asyncMiddleware(async (request, response, next) => {
  const whereClause = {};
  let auditDetails = {};

  if (request.query.firstName) {
    whereClause.first_name = { [Op.iLike]: `${request.query.firstName}%` };
  }
  if (request.query.lastName) {
    whereClause.last_name = { [Op.iLike]: `${request.query.lastName}%` };
  }
  if (request.query.district) {
    whereClause.district = { [Op.eq]: `${request.query.district}` };
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
      transaction
    };
    const officers = await models.officer.findAndCountAll(queryOptions);

    generateAndAddAuditDetailsFromQuery(
      auditDetails,
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
