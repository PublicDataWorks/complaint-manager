const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");
const kueJobQueue = require("./jobQueue");
const scheduleExport = require("./scheduleExport");

describe("exportCases request", function() {
  let queue;

  beforeEach(() => {
    queue = kueJobQueue.createQueue();
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
  });

  afterAll(() => {
    queue.shutdown(1000, () => {});
  });

  test("create a job in the job Queue", async done => {
    const request = {
      nickname: "someUser",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name }
    };
    const response = { json: jest.fn() };

    await scheduleExport(request, response, () => {});

    expect(queue.testMode.jobs.length).toEqual(1);
    expect(queue.testMode.jobs[0].type).toEqual(JOB_OPERATION.CASE_EXPORT.key);
    expect(queue.testMode.jobs[0].data).toEqual({
      title: JOB_OPERATION.CASE_EXPORT.title,
      name: JOB_OPERATION.CASE_EXPORT.name,
      user: request.nickname
    });

    expect(response.json).toHaveBeenCalledWith({
      jobId: queue.testMode.jobs[0].id
    });
    done();
  });

  test("job should include date range", async done => {
    const request = {
      nickname: "user",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name },
      query: {
        exportStartDate: "2018-12-02",
        exportEndDate: "2019-01-14"
      }
    };

    const response = { json: jest.fn() };

    await scheduleExport(request, response, () => {});

    expect(queue.testMode.jobs.length).toEqual(1);
    expect(queue.testMode.jobs[0].data).toEqual({
      title: JOB_OPERATION.CASE_EXPORT.title,
      name: JOB_OPERATION.CASE_EXPORT.name,
      user: request.nickname,
      dateRange: {
        exportStartDate: "2018-12-02",
        exportEndDate: "2019-01-14"
      }
    });
    done();
  });
});
