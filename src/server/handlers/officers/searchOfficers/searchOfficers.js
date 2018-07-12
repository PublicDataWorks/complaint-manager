const models = require("../../../models/index");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const Op = require("sequelize").Op;

const searchOfficers = asyncMiddleware(async (request, response) => {
  const whereClause = {};

  if (request.query.firstName) {
    whereClause.first_name = { [Op.iLike]: `${request.query.firstName}%` };
  }
  if (request.query.lastName) {
    whereClause.last_name = { [Op.iLike]: `${request.query.lastName}%` };
  }
  if (request.query.district) {
    whereClause.district = { [Op.eq]: `${request.query.district}` };
  }

  const officers = await models.sequelize.transaction(async transaction => {
    const officers = await models.officer.findAll({
      where: whereClause,
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      transaction
    });

    await models.action_audit.create(
      {
        user: request.nickname,
        caseId: request.query.caseId,
        action: DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.OFFICER_DATA
      },
      { auditUser: request.nickname, transaction }
    );

    return officers;
  });

  response.send(officers);
});

module.exports = searchOfficers;
