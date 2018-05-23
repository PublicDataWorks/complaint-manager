const models = require("../../models/index");
const allowedAuditActions = ["Logged In", "Logged Out", "System Log Exported"];

const audit = async (request, response, next) => {
  if (!allowedAuditActions.includes(request.body.log)) {
    return response.sendStatus(400);
  }

  try {
    await models.audit_log.create({
      action: request.body.log,
      caseId: null,
      user: request.nickname
    });

    response.status(201).send();
  } catch (e) {
    next(e);
  }
};

module.exports = audit;
