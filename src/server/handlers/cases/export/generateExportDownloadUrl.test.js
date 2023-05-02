import models from "../../../policeDataManager/models";
import generateExportDownloadUrl from "./generateExportDownloadUrl";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  CASE_EXPORT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";

const { AUDIT_ACTION } = require("../../../../sharedUtilities/constants");

jest.mock("../../../createConfiguredS3Instance");

const user = "someUser";
const jobName = JOB_OPERATION.AUDIT_LOG_EXPORT.name;

describe("generate export download url", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
  describe("auditing", () => {
    test("create an audit for all cases export", async () => {
      let fileName = "fileInS3.csv";

      await generateExportDownloadUrl(
        fileName,
        user,
        JOB_OPERATION.CASE_EXPORT.name,
        null
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

      await generateExportDownloadUrl(fileName, user, jobName, null);

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
            exportType: jobName,
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

      await generateExportDownloadUrl(fileName, user, jobName, dateRange);

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
            exportType: jobName,
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

      await generateExportDownloadUrl(fileName, user, jobName, dateRange);

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
            exportType: jobName,
            rangeType: dateRange.type,
            rangeStart: dateRange.exportStartDate,
            rangeEnd: dateRange.exportEndDate
          })
        })
      );
    });
  });

  test("create an authenticated download url", async () => {
    let fileName = "fileInS3.csv";

    const authenticatedUrl = await generateExportDownloadUrl(
      fileName,
      user,
      jobName
    );

    expect(authenticatedUrl).toEqual("url");
  });
});
