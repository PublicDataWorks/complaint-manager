import { BAD_DATA_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");
const kueJobQueue = require("./jobQueue");
import scheduleExport from "./scheduleExport";
import Boom from "boom";
import { getAndValidateDateRangeData } from "./scheduleExport";
import { expectError } from "../../../../sharedTestHelpers/expectError";
import {
  CASE_EXPORT_TYPE,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
const httpMocks = require("node-mocks-http");

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

  test("throws error with invalid date range", async () => {
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

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(queue.testMode.jobs.length).toEqual(0);
  });

  test("job should include date range for audit log export", async done => {
    const request = {
      nickname: "user",
      params: { operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name },
      query: {
        exportStartDate: "2018-12-02",
        exportEndDate: "2019-01-14"
      },
      user: {
        scope: `${USER_PERMISSIONS.EXPORT_AUDIT_LOG}`
      }
    };

    const response = { json: jest.fn() };

    await scheduleExport(request, response, () => {});

    expect(queue.testMode.jobs.length).toEqual(1);
    expect(queue.testMode.jobs[0].data).toEqual({
      title: JOB_OPERATION.AUDIT_LOG_EXPORT.title,
      name: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
      user: request.nickname,
      dateRange: {
        exportStartDate: "2018-12-02",
        exportEndDate: "2019-01-14"
      }
    });
    done();
  });

  test("job should include date range and type for case export", async done => {
    const request = {
      nickname: "user",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name },
      query: {
        exportStartDate: "2018-12-02",
        exportEndDate: "2019-01-14",
        type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
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
        exportEndDate: "2019-01-14",
        type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
      }
    });
    done();
  });

  describe("getAndValidateDateRangeData", () => {
    describe("audit log export", () => {
      test("", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {}
        });

        expect(getAndValidateDateRangeData(request)).toEqual(null);
      });

      test("returns null with no query parameters", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {}
        });

        expect(getAndValidateDateRangeData(request)).toEqual(null);
      });

      test("throws no end date error with just export start date", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {
            exportStartDate: "2016-12-12"
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_END_DATE)
        );
      });

      test("throws no start date error with just export end date", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {
            exportEndDate: "2016-12-12"
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_START_DATE)
        );
      });

      test("throws incorrect order error if dates out of order", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {
            exportStartDate: "2019-01-01",
            exportEndDate: "2016-01-01"
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.DATE_RANGE_IN_INCORRECT_ORDER)
        );
      });

      test("returns date range if valid", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {
            exportStartDate: "2018-01-01",
            exportEndDate: "2019-01-01"
          }
        });

        expect(getAndValidateDateRangeData(request)).toEqual({
          exportStartDate: "2018-01-01",
          exportEndDate: "2019-01-01"
        });
      });

      test("returns date range if valid", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.AUDIT_LOG_EXPORT.name
          },
          query: {
            exportStartDate: "2018-01-01",
            exportEndDate: "2019-01-01",
            type: "type"
          }
        });

        expect(getAndValidateDateRangeData(request)).toEqual({
          exportStartDate: "2018-01-01",
          exportEndDate: "2019-01-01"
        });
      });
    });

    describe("all cases export", () => {
      test("returns null with no query parameters", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {}
        });

        expect(getAndValidateDateRangeData(request)).toEqual(null);
      });

      test("throws no end date error when no end date", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {
            exportStartDate: "2016-12-12",
            type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_END_DATE)
        );
      });

      test("throws no start date error with export start date missing", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {
            exportEndDate: "2016-12-12",
            type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_START_DATE)
        );
      });

      test("throws no type error with type missing", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {
            exportStartDate: "2016-01-01",
            exportEndDate: "2016-12-12"
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_TYPE)
        );
      });

      test("throws error when only type is provided", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {
            type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_PARAMETERS)
        );
      });

      test("throws correct error type is missing and dates out of order", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {
            exportStartDate: "2016-12-01",
            exportEndDate: "2002-12-03"
          }
        });

        expectError(
          () => getAndValidateDateRangeData(request),
          Boom.badData(BAD_DATA_ERRORS.MISSING_DATE_RANGE_TYPE)
        );
      });

      test("returns date range with type if valid", () => {
        const request = httpMocks.createRequest({
          params: {
            operation: JOB_OPERATION.CASE_EXPORT.name
          },
          query: {
            exportStartDate: "2002-12-03",
            exportEndDate: "2016-12-01",
            type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
          }
        });

        expect(getAndValidateDateRangeData(request)).toEqual({
          exportStartDate: "2002-12-03",
          exportEndDate: "2016-12-01",
          type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
        });
      });
    });
  });
});
