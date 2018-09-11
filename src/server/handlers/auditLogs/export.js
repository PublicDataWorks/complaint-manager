const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  AUDIT_ACTION,
  JOB_OPERATION,
  QUEUE_PREFIX
} = require("../../../sharedUtilities/constants");

const asyncMiddleware = require("../asyncMiddleware");

const config = require("../../config/config")[process.env.NODE_ENV];

const kue = require("kue"),
  queue = kue.createQueue({
    prefix: QUEUE_PREFIX,
    redis: `redis://${config.queue.host}:${config.queue.port}`
  });

const exportAuditLog = asyncMiddleware(async (request, response) => {
  queue
    .create(JOB_OPERATION.AUDIT_LOG_EXPORT, {
      title: "Last year audit log export",
      fileName: "audit_log_export.csv"
    })
    .attempts(3)
    .backoff({ delay: 60 * 1000, type: "exponential" })
    .save();

  await models.sequelize.transaction(async t => {
    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.AUDIT_LOG,
        caseId: null,
        user: request.nickname
      },
      {
        transaction: t
      }
    );
  });
});

module.exports = exportAuditLog;
