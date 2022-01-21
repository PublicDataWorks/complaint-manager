import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getPublicData from "./getPublicData";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import moment from "moment";
import * as httpMocks from "node-mocks-http";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import * as countComplaintsByComplainantType from "./queries/countComplaintsByComplainantType";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

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

const MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_DATA_VALUES = {
  [PERSON_TYPE.CIVILIAN.abbreviation]: [
    {
      date: "Jun 19",
      count: 1
    }
  ],
  [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: [
    {
      date: "Jun 19",
      count: 8
    }
  ],
  [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: [
    {
      date: "Jun 19",
      count: 3
    }
  ],
  AC: [
    {
      date: "Jun 19",
      count: 0
    }
  ]
};

const MOCK_TOP_10_TAGS = [
  {
    name: "Chicago hot dogs",
    count: "3"
  },
  {
    name: "Tofu",
    count: "2"
  },
  {
    name: "karancitoooooo",
    count: "1"
  },
  {
    name: "sabs",
    count: "1"
  }
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

jest.mock("../../handlers/data/queries/countTop10Tags", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_TOP_10_TAGS;
  })
}));

jest.mock(
  "../../handlers/data/queries/countMonthlyComplaintsByComplainantType",
  () => ({
    executeQuery: jest.fn(() => {
      return MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_DATA_VALUES;
    })
  })
);

describe("getPublicData", () => {
  let next, response;
  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(() => {
    next = jest.fn();
    response = httpMocks.createResponse();
  });

  test("should call getPublicData when countComplaintsByIntakeSource query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByIntakeSource",
        minDate: `${moment().format("YYYY")}-01-01`
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(countComplaintsByIntakeSource.executeQuery).toHaveBeenCalledWith(
      "tuser",
      { minDate: `${moment().format("YYYY")}-01-01` }
    );
    expect(response._getData()).toEqual(MOCK_INTAKE_SOURCE_DATA_VALUES);
  });

  test("should call getPublicData when countComplaintTotals query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintTotals"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(response._getData()).toEqual(MOCK_TOTAL_DATA_VALUES);
  });

  test("should call getPublicData when countComplaintsByComplainantType query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByComplainantType",
        minDate: `${moment().format("YYYY")}-01-01`
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(countComplaintsByComplainantType.executeQuery).toHaveBeenCalledWith(
      "tuser",
      { minDate: `${moment().format("YYYY")}-01-01` }
    );
    expect(response._getData()).toEqual(MOCK_COMPLAINANT_TYPE_DATA_VALUES);
  });

  test("should call getPublicData when countMonthlyComplaintsByComplainantType query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType:
          QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS,
        minDate: moment().subtract(12, "months").format("YYYY-MM-DD")
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(response._getData()).toEqual(
      MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_DATA_VALUES
    );
  });

  test("should call getPublicData when countTop10Tags query called", () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countTop10Tags"
      }
    });
  });

  test("throws an error when query param is not supported", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "unknown"
      },
      nickname: "tuser"
    });

    await getPublicData(request, response, next);

    expect(next).toHaveBeenCalledWith(
      Boom.badData(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED)
    );
  });
});
