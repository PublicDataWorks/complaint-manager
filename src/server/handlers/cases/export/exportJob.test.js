import {
  JOB_OPERATION,
  QUEUE_PREFIX
} from "../../../../sharedUtilities/constants";
import generateExportDownloadUrl from "./generateExportDownloadUrl";
import getInstance from "./queueFactory";
import Queue from "bull/lib/queue";
import Job from "bull/lib/job";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const AUTHENTICATED_URL = "authenticated url";
jest.mock("./generateExportDownloadUrl", () =>
  jest.fn((file, user, auditSubject) => "authenticated url")
);
jest.mock("./queueFactory");
jest.mock("bull/lib/queue");
jest.mock("bull/lib/job");

const exportJob = require("./exportJob");
const Boom = require("boom");

const response = { json: jest.fn() };

describe("Get an export job", () => {
  let queueMock;
  beforeEach(() => {
    queueMock = new Queue(QUEUE_PREFIX);
    getInstance.mockImplementation(() => queueMock);
  });

  test("get an export job by id", async () => {
    const jobMock = new Job();
    jobMock.getState.mockResolvedValue("waiting");
    jobMock.id = 123;
    queueMock.getJob.mockResolvedValue(jobMock);

    const request = { nickname: "someUser", params: { jobId: 123 } };

    await exportJob(request, response, jest.fn());

    expect(response.json).toHaveBeenCalledWith({
      id: 123,
      state: "waiting",
      downLoadUrl: undefined
    });
  });

  test("should returns a BAD REQUEST when job cannot be retrieved by id", async () => {
    queueMock.getJob.mockResolvedValue(null);

    const next = jest.fn();

    const request = { nickname: "someUser", params: { jobId: 150 } };

    await exportJob(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_JOB)
    );
  });

  test("set job download url when job is complete", async () => {
    const jobMock = new Job();
    jobMock.getState.mockResolvedValue("completed");
    jobMock.id = 123;
    jobMock.returnvalue = { Key: "file.name" };
    jobMock.data = { name: "blah", dateRange: null };
    queueMock.getJob.mockResolvedValue(jobMock);

    const request = { nickname: "someUser", params: { jobId: 123 } };

    await exportJob(request, response, jest.fn());

    expect(response.json).toHaveBeenCalledWith({
      id: 123,
      state: "completed",
      downLoadUrl: AUTHENTICATED_URL
    });
  });

  test("send audit all case subject when job type is export cases", async () => {
    const jobMock = new Job();
    jobMock.getState.mockResolvedValue("completed");
    jobMock.id = 123;
    jobMock.returnvalue = { Key: "file.name" };
    jobMock.data = { title: "test job", name: JOB_OPERATION.CASE_EXPORT.name };
    queueMock.getJob.mockResolvedValue(jobMock);

    const request = { nickname: "someUser", params: { jobId: 123 } };

    await exportJob(request, response, jest.fn());

    expect(generateExportDownloadUrl).toHaveBeenCalledWith(
      "file.name",
      request.nickname,
      JOB_OPERATION.CASE_EXPORT.name,
      undefined
    );
  });

  test("send audit audit log subject and date range when job type is audit log", async () => {
    const jobMock = new Job();
    jobMock.getState.mockResolvedValue("completed");
    jobMock.id = 123;
    jobMock.returnvalue = { Key: "file.name" };
    jobMock.data = {
      title: "test job",
      name: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
      dateRange: { exportStartDate: "date", exportEndDate: "date" }
    };
    queueMock.getJob.mockResolvedValue(jobMock);

    const request = { nickname: "someUser", params: { jobId: 123 } };

    await exportJob(request, response, jest.fn());

    expect(generateExportDownloadUrl).toHaveBeenCalledWith(
      "file.name",
      request.nickname,
      JOB_OPERATION.AUDIT_LOG_EXPORT.name,
      jobMock.data.dateRange
    );
  });
});
