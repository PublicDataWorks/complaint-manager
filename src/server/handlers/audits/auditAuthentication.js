import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";

const {
  AUDIT_TYPE,
  AUDIT_ACTION
} = require("../../../sharedUtilities/constants");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const allowedAuditActions = [AUDIT_ACTION.LOGGED_IN, AUDIT_ACTION.LOGGED_OUT];

const auditAuthentication = asyncMiddleware(async (request, response) => {
  if (!allowedAuditActions.includes(request.body.log)) {
    return response.sendStatus(400);
  }

  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );
  if (newAuditFeatureToggle) {
    await models.audit.create({
      auditAction: request.body.log,
      user: request.nickname
    });
  } else {
    await models.action_audit.create({
      auditType: AUDIT_TYPE.AUTHENTICATION,
      action: request.body.log,
      caseId: null,
      user: request.nickname
    });
  }

  response.status(201).send();
});

module.exports = auditAuthentication;
