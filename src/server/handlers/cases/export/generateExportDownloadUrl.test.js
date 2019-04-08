import models from "../../../models";
import generateExportDownloadUrl from "./generateExportDownloadUrl";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { CASE_EXPORT_TYPE } from "../../../../sharedUtilities/constants";

const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");

jest.mock("../../../createConfiguredS3Instance");

createConfiguredS3Instance.mockImplementation(() => ({
  getSignedUrl: jest.fn(() => "authenticated file url")
}));

describe("generate export download url", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  test("create an authenticated download url", async done => {
    let fileName = "fileInS3.csv";

    const authenticatedUrl = await generateExportDownloadUrl(
      fileName,
      "someUser"
    );

    expect(authenticatedUrl).toEqual("authenticated file url");

    done();
  });

  test("create an audit for all cases export", async () => {
    let fileName = "fileInS3.csv";

    await generateExportDownloadUrl(
      fileName,
      "someUser",
      AUDIT_SUBJECT.ALL_WORKING_CASES
    );

    const actionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.ALL_WORKING_CASES
      }
    });

    expect(actionAudit.user).toEqual("someUser");
  });

  test("create an audit for audit log export", async () => {
    let fileName = "fileInS3.csv";

    await generateExportDownloadUrl(
      fileName,
      "someUser",
      AUDIT_SUBJECT.AUDIT_LOG
    );

    const actionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.AUDIT_LOG
      }
    });

    expect(actionAudit.user).toEqual("someUser");
  });

  test("create an audit for audit log export with date range if included", async () => {
    let fileName = "fileInS3.csv";

    await generateExportDownloadUrl(
      fileName,
      "someUser",
      AUDIT_SUBJECT.AUDIT_LOG,
      { exportStartDate: "2011-12-21", exportEndDate: "2012-12-21" }
    );

    const actionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.AUDIT_LOG
      }
    });

    expect(actionAudit.user).toEqual("someUser");
    expect(actionAudit.auditDetails).toEqual({
      "Export Range": ["Dec 21, 2011 to Dec 21, 2012"]
    });
  });
  test("create an audit for cases export with date range if included", async () => {
    let fileName = "fileInS3.csv";

    await generateExportDownloadUrl(
      fileName,
      "someUser",
      AUDIT_SUBJECT.AUDIT_LOG,
      {
        exportStartDate: "2011-12-21",
        exportEndDate: "2012-12-21",
        type: CASE_EXPORT_TYPE.INCIDENT_DATE
      }
    );

    const actionAudit = await models.action_audit.findOne({
      where: {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.AUDIT_LOG
      }
    });

    expect(actionAudit.user).toEqual("someUser");
    expect(actionAudit.auditDetails).toEqual({
      "Date Type": ["Incident Date"],
      "Export Range": ["Dec 21, 2011 to Dec 21, 2012"]
    });
  });
});
