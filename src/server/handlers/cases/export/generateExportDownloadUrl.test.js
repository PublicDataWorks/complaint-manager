import models from "../../../models";
import generateExportDownloadUrl from "./generateExportDownloadUrl";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  CASE_EXPORT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";

const {
  AUDIT_ACTION,
  AUDIT_TYPE
} = require("../../../../sharedUtilities/constants");

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");

jest.mock("../../../createConfiguredS3Instance");

createConfiguredS3Instance.mockImplementation(() => ({
  getSignedUrl: jest.fn(() => "authenticated file url")
}));

const user = "someUser";

describe("generate export download url", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  describe("newAuditFeatureToggle disabled", () => {
    const newAuditFeatureToggle = false;

    test("create an audit for all cases export", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.CASE_EXPORT.name,
        null,
        newAuditFeatureToggle
      );

      const actionAudit = await models.action_audit.findOne({
        where: {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.CASE_EXPORT.auditSubject
        }
      });

      expect(actionAudit.user).toEqual(user);
    });

    test("create an audit for audit log export", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        null,
        newAuditFeatureToggle
      );

      const actionAudit = await models.action_audit.findOne({
        where: {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.AUDIT_LOG_EXPORT.auditSubject
        }
      });

      expect(actionAudit.user).toEqual(user);
    });

    test("create an audit for audit log export with date range if included", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        { exportStartDate: "2011-12-21", exportEndDate: "2012-12-21" },
        newAuditFeatureToggle
      );

      const actionAudit = await models.action_audit.findOne({
        where: {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.AUDIT_LOG_EXPORT.auditSubject
        }
      });

      expect(actionAudit.user).toEqual(user);
      expect(actionAudit.auditDetails).toEqual({
        "Export Range": ["Dec 21, 2011 to Dec 21, 2012"]
      });
    });
    test("create an audit for cases export with date range if included", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        {
          exportStartDate: "2011-12-21",
          exportEndDate: "2012-12-21",
          type: CASE_EXPORT_TYPE.INCIDENT_DATE
        },
        newAuditFeatureToggle
      );

      const actionAudit = await models.action_audit.findOne({
        where: {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: JOB_OPERATION.AUDIT_LOG_EXPORT.auditSubject
        }
      });

      expect(actionAudit.user).toEqual(user);
      expect(actionAudit.auditDetails).toEqual({
        "Date Type": ["Incident Date"],
        "Export Range": ["Dec 21, 2011 to Dec 21, 2012"]
      });
    });
  });
  describe("newAuditFeatureToggle enabled", () => {
    const newAuditFeatureToggle = true;

    test("create an audit for all cases export", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.CASE_EXPORT.name,
        null,
        newAuditFeatureToggle
      );

      const audit = await models.audit.findOne({
        include: [
          {
            as: "exportAudit",
            model: models.export_audit
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.EXPORTED,
          user: user,
          exportAudit: expect.objectContaining({
            exportType: JOB_OPERATION.CASE_EXPORT.name,
            rangeType: null,
            rangeStart: null,
            rangeEnd: null
          })
        })
      );
    });

    test("create an audit for audit log export", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        null,
        newAuditFeatureToggle
      );

      const audit = await models.audit.findOne({
        include: [
          {
            as: "exportAudit",
            model: models.export_audit
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.EXPORTED,
          user: user,
          exportAudit: expect.objectContaining({
            exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
            rangeType: null,
            rangeStart: null,
            rangeEnd: null
          })
        })
      );
    });

    test("create an audit for audit log export with date range if included", async () => {
      let fileName = "fileInS3.csv";
      const dateRange = {
        exportStartDate: "2011-12-21",
        exportEndDate: "2012-12-21"
      };

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        dateRange,
        newAuditFeatureToggle
      );

      const audit = await models.audit.findOne({
        include: [
          {
            as: "exportAudit",
            model: models.export_audit
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.EXPORTED,
          user: user,
          exportAudit: expect.objectContaining({
            exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
            rangeType: null,
            rangeStart: dateRange.exportStartDate,
            rangeEnd: dateRange.exportEndDate
          })
        })
      );
    });

    test("create an audit for cases export with date range if included", async () => {
      let fileName = "fileInS3.csv";
      const dateRange = {
        exportStartDate: "2011-12-21",
        exportEndDate: "2012-12-21",
        type: CASE_EXPORT_TYPE.INCIDENT_DATE
      };

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        dateRange,
        newAuditFeatureToggle
      );

      const audit = await models.audit.findOne({
        include: [
          {
            as: "exportAudit",
            model: models.export_audit
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          auditAction: AUDIT_ACTION.EXPORTED,
          user: user,
          exportAudit: expect.objectContaining({
            exportType: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
            rangeType: dateRange.type,
            rangeStart: dateRange.exportStartDate,
            rangeEnd: dateRange.exportEndDate
          })
        })
      );
    });
  });

  test("create an authenticated download url", async done => {
    let fileName = "fileInS3.csv";

    const authenticatedUrl = await generateExportDownloadUrl(fileName, user);

    expect(authenticatedUrl).toEqual("authenticated file url");

    done();
  });
});
