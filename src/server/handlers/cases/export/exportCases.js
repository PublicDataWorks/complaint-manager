const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  JOB_OPERATION,
  QUEUE_PREFIX
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");

const config = require("../../../config/config")[process.env.NODE_ENV];

const kue = require("kue");

const queue = kue.createQueue({
  prefix: QUEUE_PREFIX,
  redis: `redis://${config.queue.host}:${config.queue.port}`
});

kue.app.set("title", "Background Worker");

kue.app.listen(4000);

const exportCases = asyncMiddleware(async (request, response, next) => {
  await models.sequelize.transaction(async transaction => {
    queue
      .create(JOB_OPERATION.CASE_EXPORT, {
        title: "All cases export",
        fileName: "case_export.csv",
        user: request.nickname
      })
      .attempts(3)
      .backoff({ delay: 60 * 1000, type: "exponential" })
      .ttl(120 * 1000)
      .save();

    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.ALL_CASE_INFORMATION,
        user: request.nickname
      },
      { transaction }
    );
  });

  response.send();
});

module.exports = exportCases;
