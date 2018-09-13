//Had to use separate file for this test to mock import
import app from "../../../server/server";
import stringify from "csv-stringify/lib/index";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  AUDIT_ACTION,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import request from "supertest";
import models from "../../../server/models";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs
} from "../../../server/testHelpers/requestTestHelpers";
jest.mock("csv-stringify/lib/index");

xdescribe("GET /api/export-audit-log", () => {
  let nickname, tokenWithExportPermission;

  beforeEach(async () => {
    nickname = "nickName";
    tokenWithExportPermission = buildTokenWithPermissions(
      USER_PERMISSIONS.EXPORT_AUDIT_LOG,
      nickname
    );
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  test(
    "does not save audit entry in db when error occurs creating csv",
    suppressWinstonLogs(async () => {
      stringify.mockImplementation(() => {
        throw "error";
      });
      await request(app)
        .get("/api/export-audit-log")
        .set("Authorization", `Bearer ${tokenWithExportPermission}`)
        .expect(500);

      const exportActionAudit = await models.action_audit.find({
        where: {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: AUDIT_SUBJECT.AUDIT_LOG,
          caseId: null,
          user: nickname
        }
      });
      expect(exportActionAudit).toBeNull();
    })
  );
});
