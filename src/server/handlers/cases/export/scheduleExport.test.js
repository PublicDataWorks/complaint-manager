import { BAD_DATA_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const { JOB_OPERATION } = require("../../../../sharedUtilities/constants");
import scheduleExport from "./scheduleExport";
import Boom from "boom";
import { getAndValidateDateRangeData } from "./scheduleExport";
import { expectError } from "../../../../sharedTestHelpers/expectError";
import {
  CASE_EXPORT_TYPE,
  QUEUE_PREFIX,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
const config = require("../../../config/config")[process.env.NODE_ENV];
const httpMocks = require("node-mocks-http");
import getInstance from "./queueFactory";
import Queue from "bull/lib/queue";
import Job from "bull/lib/job";

jest.mock("./queueFactory");
jest.mock("bull/lib/queue");
jest.mock("bull/lib/job");

describe("exportCases request", function() {
  let queueMock;

  beforeEach(() => {
    queueMock = new Queue(QUEUE_PREFIX);
    getInstance.mockImplementation(() => queueMock);
  });
  test("create a job in the job Queue", async () => {
    const jobMock = new Job();
    jobMock.id = 123;
    queueMock.add.mockResolvedValue(jobMock);

    const request = {
      nickname: "someUser",
      params: { operation: JOB_OPERATION.CASE_EXPORT.name }
    };
    const response = { json: jest.fn() };

    await scheduleExport(request, response, () => {});

    expect(queueMock.add).toHaveBeenCalledWith(
      JOB_OPERATION[request.params.operation].key,
      expect.objectContaining({
        title: JOB_OPERATION[request.params.operation].title,
        name: JOB_OPERATION[request.params.operation].name,
        user: request.nickname
      }),
      expect.objectContaining({
        attempts: config.queue.failedJobAttempts,
        timeout: config.queue.jobTimeToLive
      })
    );

    expect(response.json).toHaveBeenCalledWith({
      jobId: 123
    });
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
  });

  test("job should include date range for audit log export", async () => {
    const jobMock = new Job();
    jobMock.id = 123;
    queueMock.add.mockResolvedValue(jobMock);

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

    expect(queueMock.add).toHaveBeenCalledWith(
      JOB_OPERATION[request.params.operation].key,
      expect.objectContaining({
        title: JOB_OPERATION.AUDIT_LOG_EXPORT.title,
        name: JOB_OPERATION.AUDIT_LOG_EXPORT.name,
        user: request.nickname,
        dateRange: {
          exportStartDate: "2018-12-02",
          exportEndDate: "2019-01-14"
        }
      }),
      expect.anything()
    );
  });

  test("job should include date range and type for case export", async () => {
    const jobMock = new Job();
    jobMock.id = 123;
    queueMock.add.mockResolvedValue(jobMock);

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

    expect(queueMock.add).toHaveBeenCalledWith(
      JOB_OPERATION[request.params.operation].key,
      expect.objectContaining({
        title: JOB_OPERATION.CASE_EXPORT.title,
        name: JOB_OPERATION.CASE_EXPORT.name,
        user: request.nickname,
        dateRange: {
          exportStartDate: "2018-12-02",
          exportEndDate: "2019-01-14",
          type: CASE_EXPORT_TYPE.FIRST_CONTACT_DATE
        }
      }),
      expect.anything()
    );
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
