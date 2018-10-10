const kue = require("kue");
const generateExportDownloadUrl = require("./generateExportDownloadUrl");

jest.mock("./generateExportDownloadUrl");
jest.mock("kue");

const AUTHENTICATED_URL = "authenticated url";

generateExportDownloadUrl.mockImplementation((file, user) => AUTHENTICATED_URL);

const exportJob = require("./exportJob");

const request = { nickname: "someUser", params: { id: 123 } };
const response = { json: jest.fn() };

describe("Get an export job", () => {
  afterEach(() => {
    kue.Job.get.mockReset();
  });

  test("get an export job by id", async () => {
    const job = { id: 123, result: {}, state: () => "" };

    kue.Job.get.mockImplementation((id, callBack) => {
      callBack(undefined, job);
    });

    await exportJob(request, response, jest.fn());

    expect(response.json).toHaveBeenCalledWith(job);
  });

  test("set job download url when job is complete", async () => {
    const job = { id: 123, result: {}, state: () => "complete" };

    kue.Job.get.mockImplementation((id, callBack) => {
      callBack(undefined, job);
    });

    await exportJob(request, response, jest.fn());

    expect(job.result.downLoadUrl).toEqual(AUTHENTICATED_URL);
  });
});
