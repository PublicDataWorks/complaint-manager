import {
  ASCENDING,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import models from "../../models";
import _ from "lodash";
import {
  endOfLegacyAuditTimestamps,
  getDataChangeAuditsAndActionAuditsQuery
} from "../taskMigrationJobs/auditTransformationJobs/auditTransformHelpers";
import {
  provideAuditDetailsForDataAccessAuditsAfterCreateCase,
  setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsAfterCreateCase";

module.exports = {
  up: async () => {
    await provideAuditDetailsForDataAccessAuditsAfterCreateCase();
  },
  down: async () => {
    await setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase();
  }
};
