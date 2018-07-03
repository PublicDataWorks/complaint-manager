import request from "supertest";
import app from "../../server";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_UPDATED,
  EXPORTED,
  LOGGED_IN,
  TIMEZONE,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import parse from "csv-parse/lib/sync";
import timekeeper from "timekeeper";
import moment from "moment";
import ActionAudit from "../../../client/testUtilities/ActionAudit";
import models from "../../models/index";
import { createCaseWithoutCivilian } from "../../testHelpers/modelMothers";

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
    const timeOfExport = new Date("2018-07-01 19:00:22 CDT");
    timekeeper.freeze(timeOfExport);

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
        expect(record["Case ID"]).toEqual("");
        expect(record["Action"]).toEqual(EXPORTED);
        expect(record["Subject"]).toEqual(AUDIT_SUBJECT.AUDIT_LOG);
        expect(record["Subject ID"]).toEqual("");
        expect(record["Changes"]).toEqual("");
        expect(record["Snapshot"]).toEqual("");
        expect(record["Timestamp"]).toEqual(
          moment(timeOfExport)
            .tz(TIMEZONE)
            .format("MM/DD/YYYY HH:mm:ss z")
        );
      });
    timekeeper.reset();
  });

  test("includes login action audits", async () => {
    const actionAuditAttributes = new ActionAudit.Builder()
      .defaultActionAudit()
      .withAuditType(AUDIT_TYPE.AUTHENTICATION)
      .withAction(LOGGED_IN)
      .withCaseId(undefined)
      .withId(undefined)
      .withCreatedAt(new Date("2018-06-01 19:00:22 CDT"));
    await models.action_audit.create(actionAuditAttributes);

    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithExportPermission}`)
      .expect(200)
      .then(response => {
        const records = parse(response.text, { columns: true });
        expect(records.length).toEqual(2);

        const loginRecord = records[1];
        expect(loginRecord["Audit Type"]).toEqual(AUDIT_TYPE.AUTHENTICATION);
        expect(loginRecord["User"]).toEqual(actionAuditAttributes.user);
        expect(loginRecord["Case ID"]).toEqual("");
        expect(loginRecord["Action"]).toEqual(LOGGED_IN);
        expect(loginRecord["Subject"]).toEqual("");
        expect(loginRecord["Subject ID"]).toEqual("");
        expect(loginRecord["Changes"]).toEqual("");
        expect(loginRecord["Snapshot"]).toEqual("");
        expect(loginRecord["Timestamp"]).toEqual(
          moment(actionAuditAttributes.createdAt)
            .tz(TIMEZONE)
            .format("MM/DD/YYYY HH:mm:ss z")
        );
      });
  });

  test("includes data change audit export", async () => {
    const timeOfExport = new Date("2018-07-01 19:00:22 CDT");
    timekeeper.freeze(timeOfExport);

    const createdCase = await createCaseWithoutCivilian("nickname");

    await models.data_change_audit.find({
      where: { caseId: createdCase.id }
    });

    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithExportPermission}`)
      .expect(200)
      .then(response => {
        const records = parse(response.text, { columns: true });
        expect(records.length).toEqual(2);

        const dataChangeRecord = records[1];
        expect(dataChangeRecord["Audit Type"]).toEqual(AUDIT_TYPE.DATA_CHANGE);
        expect(dataChangeRecord["User"]).toEqual("nickname");
        expect(dataChangeRecord["Case ID"]).toEqual(`${createdCase.id}`);
        expect(dataChangeRecord["Action"]).toEqual("Created");
        expect(dataChangeRecord["Subject"]).toEqual("Case");
        expect(dataChangeRecord["Subject ID"]).toEqual(`${createdCase.id}`);
        expect(dataChangeRecord["Changes"]).toEqual("");
        expect(dataChangeRecord["Timestamp"]).toEqual(
          moment(timeOfExport)
            .tz(TIMEZONE)
            .format("MM/DD/YYYY HH:mm:ss z")
        );
      });
    timekeeper.reset();
  });

  test("includes data change audit changes and  snapshot transformation", async () => {
    await models.data_change_audit.create({
      auditType: AUDIT_TYPE.DATA_CHANGE,
      user: "smith",
      action: DATA_UPDATED,
      snapshot: { id: 5, name: "bob" },
      caseId: 1,
      modelName: "Case",
      changes: { name: { previous: "greg II", new: "bob" } },
      modelId: 20
    });

    await request(app)
      .get("/api/export-audit-log")
      .set("Authorization", `Bearer ${tokenWithExportPermission}`)
      .expect(200)
      .then(response => {
        const records = parse(response.text, { columns: true });
        expect(records.length).toEqual(2);

        const dataChangeRecord = records[1];
        expect(dataChangeRecord["Audit Type"]).toEqual(AUDIT_TYPE.DATA_CHANGE);
        expect(dataChangeRecord["User"]).toEqual("smith");
        expect(dataChangeRecord["Action"]).toEqual(DATA_UPDATED);
        expect(dataChangeRecord["Changes"]).toEqual(
          "Name changed from 'greg II' to 'bob'"
        );
        expect(dataChangeRecord["Snapshot"]).toEqual("Id: 5\nName: bob");
      });
  });
});
