import moment from "moment-timezone";

export const endOfLegacyAuditTimestamps = {
  test: moment("2019-02-26T00:00:00.000+00:00"),
  development: moment("2019-02-26T00:00:00.000+00:00"),
  ci: moment("2019-02-26T00:00:00.000+00:00"),
  staging: moment("2019-02-28T16:00:00.000+00:00"),
  production: moment("2019-03-05T00:00:00.000+00:00")
};

export const getDataChangeAuditsAndActionAuditsQuery = earliestAuditTimestamp => `
      SELECT *
      FROM
        (SELECT id,
                action,
                created_at,
                subject,
                audit_details,
                public.action_audits.user AS username,
                case_id,
                audit_type
         FROM public.action_audits
         UNION SELECT id,
                      action,
                      created_at,
                      model_name AS subject,
                      changes AS audit_details,
                      public.data_change_audits.user AS username,
                      case_id,
                      'Data Change' AS audit_type
         FROM public.data_change_audits) AS all_audits
      WHERE created_at > '${earliestAuditTimestamp.format(
        "YYYY-MM-DD HH:mm:ss.ms"
      )}'
      ORDER BY created_at ASC
`;

export const migrationExecutionTimes = {
  migration20190228: {
    test: moment("2019-03-04T11:19:02-06:00"),
    development: moment("2019-03-04T11:19:02-06:00"),
    ci: moment("2019-03-04T11:19:02-06:00"),
    staging: moment("2019-03-04T11:19:02-06:00"),
    production: moment("2019-03-07T16:35:37-05:00")
  },
  migration20190417: {
    test: moment("2019-04-19T10:34:41-05:00"),
    development: moment("2019-04-19T10:34:41-05:00"),
    ci: moment("2019-04-19T10:34:41-05:00"),
    staging: moment("2019-04-25T10:20:01-05:00"),
    production: moment("2019-04-30T10:34:41-05:00")
  },
  migration20190424: {
    test: moment("2019-05-06T09:57:59-05:00"),
    development: moment("2019-05-06T09:57:59-05:00"),
    ci: moment("2019-05-06T09:57:59-05:00"),
    staging: moment("2019-05-19T10:27:43-05:00"),
    production: moment("2019-05-14T17:03:35-05:00")
  }
};
