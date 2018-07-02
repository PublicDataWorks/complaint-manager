import request from "supertest";
import app from "../../server";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  EXPORTED,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import parse from "csv-parse/lib/sync";

describe("GET /api/export-audit-log", () => {
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

  test("should return 200 when user has token with export permissions", async () => {
    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithExportPermission}`)
      .expect(200);
  });

  test("should return 401 when user has token without export permissions", async () => {
    const tokenWithoutExportPermission = buildTokenWithPermissions(
      "",
      "nickname"
    );
    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithoutExportPermission}`)
      .expect(401);
  });

  test("should return audit log csv", async () => {
    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithExportPermission}`)
      .expect(200)
      .then(response => {
        expect(response.text).toEqual(
          expect.stringContaining(
            "Audit Type,User,Case ID,Action,Subject,Subject ID,Changes,Snapshot,Timestamp\n"
          )
        );
      });
  });

  test("it includes export audit type", async () => {
    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithExportPermission}`)
      .expect(200)
      .then(response => {
        const records = parse(response.text, { columns: true });
        expect(records.length).toEqual(1);

        const record = records[0];
        expect(record["Audit Type"]).toEqual(AUDIT_TYPE.EXPORT);
        expect(record["User"]).toEqual(nickname);
        expect(record["Action"]).toEqual(EXPORTED);
        expect(record["Subject"]).toEqual(AUDIT_SUBJECT.AUDIT_LOG);
        // expect(record["Timestamp"]).toEqual("2018-07-01 19:00:22 CDT"); // test this with timekeeper https://github.com/vesln/timekeeper
      });
  });
});
