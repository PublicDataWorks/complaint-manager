import moment from "moment";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getData from "./getData";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import * as httpMocks from "node-mocks-http";
import * as countComplaintsByIntakeSource from "./queries/countComplaintsByIntakeSource";
import * as countComplaintsByComplainantType from "./queries/countComplaintsByComplainantType";
import * as countMonthlyComplaintsByComplainantType from "./queries/countMonthlyComplaintsByComplainantType";
import * as countTop10Tags from "./queries/countTop10Tags";
import * as countTop10Allegations from "./queries/countTop10Allegations";
import * as locationData from "./queries/locationData";
import * as countComplaintsByDistrict from "./queries/countComplaintsByDistrict";
import { ISO_DATE, QUERY_TYPES } from "../../../sharedUtilities/constants";
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
const MOCK_TOP_ALLEGATIONS_VALUES = [];
const MOCK_LOCATION_DATA = [{ lat: 29, lon: -90 }];
const MOCK_DISTRICT_DATA = [{ district: "1st District", count: 17 }];

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
  "../../handlers/data/queries/countMonthlyComplaintsByComplainantType",
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

jest.mock("../../handlers/data/queries/countTop10Allegations", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_TOP_ALLEGATIONS_VALUES;
  })
}));

jest.mock("../../handlers/data/queries/locationData", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_LOCATION_DATA;
  })
}));

jest.mock("../../handlers/data/queries/countComplaintsByDistrict", () => ({
  executeQuery: jest.fn(() => {
    return MOCK_DISTRICT_DATA;
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
        minDate: `${moment().format("YYYY")}-01-01`
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countComplaintsByIntakeSource.executeQuery).toHaveBeenCalledWith(
      "tuser",
      { minDate: `${moment().format("YYYY")}-01-01` }
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
        minDate: `${moment().format("YYYY")}-01-01`
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countComplaintsByComplainantType.executeQuery).toHaveBeenCalledWith(
      "tuser",
      { minDate: `${moment().format("YYYY")}-01-01` }
    );
    expect(response._getData()).toEqual(MOCK_COMPLAINANT_TYPE_DATA_VALUES);
  });

  test("should call getData when countMonthlyComplaintsByComplainantType query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE,
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(
      countMonthlyComplaintsByComplainantType.executeQuery
    ).toHaveBeenCalledWith("tuser", {
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });
    expect(response._getData()).toEqual(
      MOCK_COMPLAINANT_TYPE_PAST_12_MONTHS_VALUES
    );
  });

  test("should call getData when countTop10Tags query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countTop10Tags",
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countTop10Tags.executeQuery).toHaveBeenCalledWith("tuser", {
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });
    expect(response._getData()).toEqual(MOCK_TOP_TAGS_VALUES);
  });

  test("should call getData when countTop10Allegations query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countTop10Allegations",
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countTop10Allegations.executeQuery).toHaveBeenCalledWith("tuser", {
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });
    expect(response._getData()).toEqual(MOCK_TOP_ALLEGATIONS_VALUES);
  });

  test("should call getData when locationData query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "locationData",
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(locationData.executeQuery).toHaveBeenCalledWith({
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });
    expect(response._getData()).toEqual(MOCK_LOCATION_DATA);
  });

  test("should call getData when districts query called", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      query: {
        queryType: "countComplaintsByDistrict",
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      },
      nickname: "tuser"
    });

    await getData(request, response, next);

    expect(countComplaintsByDistrict.executeQuery).toHaveBeenCalledWith(
      "tuser",
      {
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      }
    );
    expect(response._getData()).toEqual(MOCK_DISTRICT_DATA);
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
