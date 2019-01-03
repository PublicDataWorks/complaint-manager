//Had to use separate file for this test to mock import
import stringify from "csv-stringify/lib/index";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import models from "../../../server/models";
import {
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../server/testHelpers/requestTestHelpers";
import uploadFileToS3 from "../fileUpload/uploadFileToS3";
import exportAudit from "./export";

jest.mock("csv-stringify/lib/index");
jest.mock("../fileUpload/uploadFileToS3");

describe("GET /api/export-audit-log", () => {
  beforeEach(async () => {});

  afterEach(async () => {
    await cleanupDatabase();
  });

  test(
    "does not save audit entry in db when error occurs creating csv",
    suppressWinstonLogs(async () => {
      stringify.mockImplementation(() => {
        throw "error";
      });

      uploadFileToS3.mockImplementation(jest.fn);

      const job = { data: { user: "some user" } };
      await exportAudit(job, async () => {});

      const exportActionAudit = await models.action_audit.find({
        where: {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: AUDIT_SUBJECT.AUDIT_LOG,
          caseId: null,
          user: "some user"
        }
      });
      expect(exportActionAudit).toBeNull();
    })
  );
});
