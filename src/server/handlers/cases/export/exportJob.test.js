import { JOB_OPERATION } from "../../../../sharedUtilities/constants";
import generateExportDownloadUrl from "./generateExportDownloadUrl";

const kue = require("kue");

const AUTHENTICATED_URL = "authenticated url";
jest.mock("./generateExportDownloadUrl", () =>
  jest.fn((file, user, auditSubject) => "authenticated url")
);
jest.mock("kue");

const exportJob = require("./exportJob");

const request = { nickname: "someUser", params: { id: 123 } };
const response = { json: jest.fn() };

describe("Get an export job", () => {
  afterEach(() => {
    kue.Job.get.mockReset();
  });

  test("get an export job by id", async () => {
    const job = { id: 123, result: {}, state: () => "current state" };

    kue.Job.get.mockImplementation((id, callBack) => {
      callBack(undefined, job);
    });

    await exportJob(request, response, jest.fn());

    expect(response.json).toHaveBeenCalledWith({
      id: job.id,
      state: job.state(),
      downLoadUrl: undefined
    });
  });

  test("set job download url when job is complete", async () => {
    const job = {
      id: 123,
      data: { name: JOB_OPERATION.CASE_EXPORT.name },
      result: {},
      state: () => "complete"
    };

    kue.Job.get.mockImplementation((id, callBack) => {
      callBack(undefined, job);
    });

    await exportJob(request, response, jest.fn());

    expect(response.json).toHaveBeenCalledWith({
      id: job.id,
      state: job.state(),
      downLoadUrl: AUTHENTICATED_URL
    });
  });

  test("send audit all case subject when job type is export cases", async () => {
    const job = {
      id: 123,
      data: { name: JOB_OPERATION.CASE_EXPORT.name },
      result: { Key: "file.name" },
      state: () => "complete"
    };

    kue.Job.get.mockImplementation((id, callBack) => {
      callBack(undefined, job);
    });

    await exportJob(request, response, jest.fn());

    expect(generateExportDownloadUrl).toHaveBeenCalledWith(
      "file.name",
      request.nickname,
      JOB_OPERATION.CASE_EXPORT.name,
      undefined
    );
  });

  test("send audit audit log subject and date range when job type is audit log", async () => {
    const job = {
      id: 123,
      data: {
        name: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        dateRange: { exportStartDate: "date", exportEndDate: "date" }
      },
      result: { Key: "file.name" },
      state: () => "complete"
    };

    kue.Job.get.mockImplementation((id, callBack) => {
      callBack(undefined, job);
    });

    await exportJob(request, response, jest.fn());

    expect(generateExportDownloadUrl).toHaveBeenCalledWith(
      "file.name",
      request.nickname,
      JOB_OPERATION.AUDIT_LOG_EXPORT.name,
      job.data.dateRange
    );
  });
});
