import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getData from "./getData";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import * as httpMocks from "node-mocks-http";
import * as countComplaintTotals from "./queries/countComplaintTotals";

const MOCK_INTAKE_SOURCE_DATA_VALUES = [
  { cases: "2", name: "Email" },
  { cases: "5", name: "Facebook" },
  { cases: "3", name: "Other" }
];

const MOCK_TOTAL_DATA_VALUES = [{ ytd: 10, previousYear: 20 }];

const MOCK_COMPLAINANT_TYPE_DATA_VALUES = [
  { complainantType: "Civilian (CC)" },
  { complainantType: "Police Officer (PO)" },
  { complainantType: "Anonymous (AC)" },
  { complainantType: "Civilian Within NOPD (CN)" }
];

jest.mock("../../handlers/data/queries/countComplaintsByIntakeSource", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_INTAKE_SOURCE_DATA_VALUES;
  })
}));

jest.mock("../../handlers/data/queries/countComplaintTotals", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_TOTAL_DATA_VALUES;
  })
}));

jest.mock(
  "../../handlers/data/queries/countComplaintsByComplainantType",
  () => ({
    executeQuery: jest.fn(() => {
      return MOCK_COMPLAINANT_TYPE_DATA_VALUES;
    })
  })
);

describe("getData", () => {
  let next, response;
  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(() => {
    next = jest.fn();
    response = httpMocks.createResponse();
  });

  test("should call getData when countComplaintsByIntakeSource query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        queryType: "countComplaintsByIntakeSource"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(response._getData()).toEqual(MOCK_INTAKE_SOURCE_DATA_VALUES);
  });

  test("should call getData when countComplaintTotals query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        queryType: "countComplaintTotals"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(response._getData()).toEqual(MOCK_TOTAL_DATA_VALUES);
  });

  test("should call getData when countComplaintsByComplainantType query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        queryType: "countComplaintsByComplainantType"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(response._getData()).toEqual(MOCK_COMPLAINANT_TYPE_DATA_VALUES);
  });

  test("throws an error when query param is not supported", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        queryType: "unknown"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badData(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED)
    );
  });
});
