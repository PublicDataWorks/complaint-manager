import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getData from "./getData";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import * as httpMocks from "node-mocks-http";
import * as countComplaintTotals from "./queries/countComplaintTotals";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import * as countComplaintsByComplainantType from "./queries/countComplaintsByComplainantType";
import * as countComplaintsByComplainantTypePast12Months from "./queries/countComplaintsByComplainantTypePast12Months";
import * as countTop10Tags from "./queries/countTop10Tags";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const MOCK_INTAKE_SOURCE_DATA_VALUES = [
  { cases: "2", name: "Email" },
  { cases: "5", name: "Facebook" },
  { cases: "3", name: "Other" }
];

const MOCK_TOTAL_DATA_VALUES = [{ ytd: 10, previousYear: 20 }];

const MOCK_COMPLAINANT_TYPE_DATA_VALUES = [
  { complainantType: PERSON_TYPE.CIVILIAN.complainantLegendValue },
  {
    complainantType: PERSON_TYPE.KNOWN_OFFICER.complainantLegendValue
  },
  { complainantType: "Anonymous (AC)" },
  {
    complainantType: PERSON_TYPE.CIVILIAN_WITHIN_PD.complainantLegendValue
  }
];

const MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_VALUES = {
  [PERSON_TYPE.CIVILIAN.abbreviation]: [],
  [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: [],
  [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: [],
  AC: []
};

const MOCK_TOP_TAGS_VALUES = [];

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

jest.mock(
  "../../handlers/data/queries/countComplaintsByComplainantTypePast12Months",
  () => ({
    executeQuery: jest.fn(() => {
      return MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_VALUES;
    })
  })
);

jest.mock("../../handlers/data/queries/countTop10Tags", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_TOP_TAGS_VALUES;
  })
}));

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
      query: {
        queryType: "countComplaintsByIntakeSource",
        dateRangeType: "YTD"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countComplaintsByIntakeSource.executeQuery).toHaveBeenCalledWith(
      "tuser",
      "YTD"
    );
    expect(response._getData()).toEqual(MOCK_INTAKE_SOURCE_DATA_VALUES);
  });

  test("should call getData when countComplaintTotals query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
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
      query: {
        queryType: "countComplaintsByComplainantType",
        dateRangeType: "YTD"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countComplaintsByComplainantType.executeQuery).toHaveBeenCalledWith(
      "tuser",
      "YTD"
    );
    expect(response._getData()).toEqual(MOCK_COMPLAINANT_TYPE_DATA_VALUES);
  });

  test("should call getData when countComplaintsByComplainantTypePast12Months query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByComplainantTypePast12Months"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(
      countComplaintsByComplainantTypePast12Months.executeQuery
    ).toHaveBeenCalledWith("tuser");
    expect(response._getData()).toEqual(
      MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_VALUES
    );
  });

  test("should call getData when countTop10Tags query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countTop10Tags"
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countTop10Tags.executeQuery).toHaveBeenCalledWith("tuser");
    expect(response._getData()).toEqual(MOCK_TOP_TAGS_VALUES);
  });

  test("throws an error when query param is not supported", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
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
