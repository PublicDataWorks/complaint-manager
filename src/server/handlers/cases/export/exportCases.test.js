const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");

const { exportCases, kueJobQueue } = require("./exportCases");

describe("exportCases request", function() {
  beforeEach(() => {
    kueJobQueue.testMode.enter();
  });

  afterEach(() => {
    kueJobQueue.testMode.clear();
  });

  afterAll(() => {
    kueJobQueue.shutdown(1000, () => {});
  });

  test("create a job in the job Queue", async done => {
    const request = { nickname: "someUser" };
    const response = { json: jest.fn() };

    await exportCases(request, response, () => {});

    expect(kueJobQueue.testMode.jobs.length).toEqual(1);
    expect(kueJobQueue.testMode.jobs[0].type).toEqual(
      JOB_OPERATION.CASE_EXPORT.key
    );
    expect(kueJobQueue.testMode.jobs[0].data).toEqual({
      title: JOB_OPERATION.CASE_EXPORT.title,
      fileName: "case_export.csv",
      user: request.nickname
    });

    expect(response.json).toHaveBeenCalledWith({
      jobId: kueJobQueue.testMode.jobs[0].id
    });
    done();
  });
});
