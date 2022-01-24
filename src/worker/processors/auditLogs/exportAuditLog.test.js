import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  ISO_DATE,
  JOB_OPERATION,
  TIMEZONE
} from "../../../sharedUtilities/constants";
import { cleanupDatabase } from "../../../server/testHelpers/requestTestHelpers";
import parse from "csv-parse/lib/sync";
import timekeeper from "timekeeper";
import moment from "moment-timezone";
import models from "../../../server/policeDataManager/models/index";
import uploadFileToS3 from "../fileUpload/uploadFileToS3";
import exportAuditLog from "./exportAuditLog";

jest.mock("../fileUpload/uploadFileToS3", () => jest.fn());

describe("exportAuditLog", () => {
  const nickname = "nickName";
  const awsResult = "awsResult";
  const jobDone = jest.fn();
  let job, jobWithDateRange;

  let records = [];

  beforeEach(async () => {
    records = [];
    uploadFileToS3.mockImplementation(
      (jobId, dataToUpload, filename, fileType) => {
        records = parse(dataToUpload, { columns: true });
        return awsResult;
      }
    );
    job = { data: { user: nickname } };
    jobWithDateRange = {
      data: {
        user: nickname,
        dateRange: {
          exportStartDate: "2018-01-01",
          exportEndDate: "2018-12-31"
        }
      }
    };
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should upload audit log csv and return s3 url to done with correct filename", async () => {
    await exportAuditLog(job, jobDone);

    expect(uploadFileToS3).toHaveBeenCalledWith(
      job.id,
      expect.stringContaining(
        "Audit Type,User,Case Database ID,Action,Audit Subject,Subject Database ID,Changes,Audit Details,Timestamp\n"
      ),
      JOB_OPERATION.AUDIT_LOG_EXPORT.filename,
      JOB_OPERATION.AUDIT_LOG_EXPORT.key
    );
    expect(jobDone).toHaveBeenCalledWith(null, awsResult);
  });

  test("should upload audit log csv and return s3 url to done with filename with ranged dates", async () => {
    await exportAuditLog(jobWithDateRange, jobDone);

    const startDateString = moment(
      jobWithDateRange.data.dateRange.exportStartDate
    ).format(ISO_DATE);
    const endDateString = moment(
      jobWithDateRange.data.dateRange.exportEndDate
    ).format(ISO_DATE);

    expect(uploadFileToS3).toHaveBeenCalledWith(
      job.id,
      expect.stringContaining(
        "Audit Type,User,Case Database ID,Action,Audit Subject,Subject Database ID,Changes,Audit Details,Timestamp\n"
      ),
      `${JOB_OPERATION.AUDIT_LOG_EXPORT.filename}_${startDateString}_to_${endDateString}`,
      JOB_OPERATION.AUDIT_LOG_EXPORT.key
    );
    expect(jobDone).toHaveBeenCalledWith(null, awsResult);
  });

  describe("auditing", () => {
    test("it includes authentication audit type", async () => {
      const timeOfLogin = new Date("2018-07-01 19:00:22 CDT");
      timekeeper.freeze(timeOfLogin);
      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "someuser",
        managerType: "complaint"
      });

      await exportAuditLog(job, jobDone);

      expect(records.length).toEqual(1);
      const record = records[0];
      expect(record["Audit Type"]).toEqual(AUDIT_TYPE.AUTHENTICATION);
      expect(record["User"]).toEqual("someuser");
      expect(record["Case Database ID"]).toEqual("");
      expect(record["Action"]).toEqual(AUDIT_ACTION.LOGGED_IN);
      expect(record["Audit Subject"]).toEqual("");
      expect(record["Subject Database ID"]).toEqual("");
      expect(record["Changes"]).toEqual("");
      expect(record["Audit Details"]).toEqual("");
      expect(record["Timestamp"]).toEqual(
        moment(timeOfLogin).tz(TIMEZONE).format("MM/DD/YYYY HH:mm:ss z")
      );
      timekeeper.reset();
    });

    test("handle date ranges in local timezone", async () => {
      const timezoneJob = {
        data: {
          user: nickname,
          dateRange: {
            exportStartDate: "2000-01-01",
            exportEndDate: "2000-02-03"
          }
        }
      };

      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "dough",
        managerType: "complaint",
        createdAt: moment.tz("1999-12-31 23:59:59", TIMEZONE)
      });
      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "basil",
        managerType: "complaint",
        createdAt: moment.tz("2000-01-01 00:00:00", TIMEZONE)
      });
      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "mom",
        managerType: "complaint",
        createdAt: moment.tz("2000-02-03 23:59:00", TIMEZONE)
      });
      await models.audit.create({
        auditAction: AUDIT_ACTION.LOGGED_IN,
        user: "bruce",
        managerType: "complaint",
        createdAt: moment.tz("2000-02-04 00:00:00", TIMEZONE)
      });

      await exportAuditLog(timezoneJob, jobDone);

      expect(records.length).toEqual(2);

      expect(records).toEqual([
        expect.objectContaining({ User: "mom" }),
        expect.objectContaining({ User: "basil" })
      ]);
    });
  });
});
