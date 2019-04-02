import { BAD_DATA_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");
const kueJobQueue = require("./jobQueue");
const scheduleExport = require("./scheduleExport");
import Boom from "boom";

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

  test("throws error if date range is out of order", async () => {
    const request = {
      nickname: "user",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name },
      query: {
        exportStartDate: "2019-01-14",
        exportEndDate: "2018-12-02"
      }
    };
    const next = jest.fn();

    const response = { json: jest.fn() };

    await scheduleExport(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badData(BAD_DATA_ERRORS.DATE_RANGE_IN_INCORRECT_ORDER)
    );
    expect(queue.testMode.jobs.length).toEqual(0);
  });

  test("throws error if start date in date range is missing", async () => {
    const request = {
      nickname: "user",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name },
      query: {
        exportStartDate: null,
        exportEndDate: "2018-12-02"
      }
    };
    const next = jest.fn();

    const response = { json: jest.fn() };

    await scheduleExport(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_START_DATE)
    );
    expect(queue.testMode.jobs.length).toEqual(0);
  });

  test("throws error if start date in date range is missing", async () => {
    const request = {
      nickname: "user",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name },
      query: {
        exportStartDate: "2018-12-02",
        exportEndDate: null
      }
    };
    const next = jest.fn();

    const response = { json: jest.fn() };

    await scheduleExport(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_END_DATE)
    );
    expect(queue.testMode.jobs.length).toEqual(0);
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
