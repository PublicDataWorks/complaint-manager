const {
  DEFAULT_PAGINATION_LIMIT,
  DATA_VIEWED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../sharedUtilities/constants");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const Op = require("sequelize").Op;

const searchAllegations = asyncMiddleware(async (request, response) => {
  const whereClause = {};
  if (request.query.rule) {
    whereClause.rule = { [Op.eq]: `${request.query.rule}` };
  }

  if (request.query.paragraph) {
    whereClause.paragraph = { [Op.eq]: `${request.query.paragraph}` };
  }

  if (request.query.directive) {
    whereClause.directive = { [Op.iLike]: `%${request.query.directive}%` };
  }

  const offset = request.query.page
    ? (request.query.page - 1) * DEFAULT_PAGINATION_LIMIT
    : null;

  const allegations = await models.sequelize.transaction(async transaction => {
    const allegations = await models.allegation.findAndCountAll({
      where: whereClause,
      order: [["rule", "ASC"], ["paragraph", "ASC"], ["directive", "ASC"]],
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: offset,
      transaction
    });

    const caseOfficer = await models.case_officer.findById(
      request.query.caseOfficerId
    );

    let caseOfficerFullName;
    if (caseOfficer) {
      caseOfficerFullName = caseOfficer.fullName;
    } else {
      caseOfficerFullName = "Unknown Officer";
    }

    await models.action_audit.create(
      {
        user: request.nickname,
        caseId: request.query.caseId,
        action: DATA_VIEWED,
        auditType: AUDIT_TYPE.PAGE_VIEW,
        subject: AUDIT_SUBJECT.OFFICER_ALLEGATIONS,
        subjectId: request.query.caseOfficerId,
        subjectDetails: caseOfficerFullName
      },
      { auditUser: request.nickname, transaction }
    );

    return allegations;
  });

  response.send(allegations);
});

module.exports = searchAllegations;
