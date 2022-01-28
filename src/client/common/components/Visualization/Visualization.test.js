import {
  QUERY_TYPES,
  DATE_RANGE_TYPE,
  ISO_DATE
} from "../../../../sharedUtilities/constants";
import { PlotlyWrapper } from "./PlotlyWrapper";
import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import Visualization, { generateDateRange } from "./Visualization";
import mediaQuery from "css-mediaquery";
import moment from "moment";
import { getQueryModelByQueryType } from "./models/queryModelFactory";

function createMatchMedia(width) {
  return query => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {}
  });
}

jest.mock("./PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

const MOCK_DATA = {
  CC: 1
};

const MOCK_CONFIG = {
  responsive: false,
  useResizeHandler: false
};

const MOCK_STYLE = {
  height: "100%",
  width: "100%",
  marginLeft: "10px",
  marginRight: "10px"
};

const MOCK_LAYOUT = {};
const MOCK_MOBILE_LAYOUT = { mobileLayout: true };

const MOCK_MODEL = {
  getVisualizationLayout: jest.fn(options =>
    options.isMobile ? MOCK_MOBILE_LAYOUT : MOCK_LAYOUT
  ),
  getVisualizationData: jest.fn(options => ({ data: MOCK_DATA })),
  visualizationConfig: MOCK_CONFIG
};

jest.mock("./models/queryModelFactory", () => ({
  getQueryModelByQueryType: jest.fn(query => {
    return MOCK_MODEL;
  })
}));

describe("Visualization", () => {
  beforeEach(() => {
    window.matchMedia = createMatchMedia(1000);
  });

  afterEach(() => {
    MOCK_MODEL.getVisualizationData.mockClear();
  });

  test("should not fetch data on viewport updates", async () => {
    // Arrange
    const queryOptions = { dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS };
    // Act
    let visualization;
    await act(async () => {
      visualization = render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
          queryOptions={queryOptions}
        />
      );
    });
    window.matchMedia = createMatchMedia(500);
    await act(async () => {
      visualization.rerender(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
          queryOptions={queryOptions}
        />
      );
    });

    expect(screen.queryAllByTestId("visualizationDateControl")).toHaveLength(0);

    const lastCall = PlotlyWrapper.mock.calls.length - 1;
    expect(PlotlyWrapper.mock.calls[lastCall][0]).toEqual({
      style: MOCK_STYLE,
      config: MOCK_CONFIG,
      data: MOCK_DATA,
      layout: MOCK_MOBILE_LAYOUT
    });
  });

  test("should fetch new data when dropdown changed", async () => {
    // Arrange
    const queryOptions = { dateRangeType: DATE_RANGE_TYPE.YTD };
    // Act
    let visualization;
    await act(async () => {
      visualization = render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
          queryOptions={queryOptions}
          hasDropdown={true}
        />
      );
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId("visualizationDateControl"), {
        target: { value: DATE_RANGE_TYPE.PAST_12_MONTHS }
      });
    });

    expect(MOCK_MODEL.getVisualizationData).toHaveBeenCalledTimes(2);
  });

  test("should pass correct data and layout options to PlotlyWrapper", async () => {
    const queryOptions = { dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS };
    // Act
    await act(async () => {
      render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
          queryOptions={queryOptions}
        />
      );
    });

    // Assert
    expect(MOCK_MODEL.getVisualizationLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        options: queryOptions,
        newData: expect.objectContaining({ data: MOCK_DATA })
      })
    );
    const lastCall = PlotlyWrapper.mock.calls.length - 1;
    expect(PlotlyWrapper.mock.calls[lastCall][0]).toEqual({
      style: MOCK_STYLE,
      config: MOCK_CONFIG,
      data: MOCK_DATA,
      layout: MOCK_LAYOUT
    });
  });

  describe("generateDateRange", () => {
    test("should return min date as 12 months ago if date range is PAST_12_MONTHS", () => {
      expect(generateDateRange(DATE_RANGE_TYPE.PAST_12_MONTHS)).toEqual({
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      });
    });

    test("should return min date as January 1 if date range is YTD", () => {
      expect(generateDateRange(DATE_RANGE_TYPE.YTD)).toEqual({
        minDate: `${moment().format("YYYY")}-01-01`
      });
    });

    test("should return max date as Dec 31 of that year and min date as Jan 1 of that year if date range is a year", () => {
      expect(generateDateRange("2018")).toEqual({
        minDate: "2018-01-01",
        maxDate: "2019-01-01"
      });
    });

    test("should return past 12 months if undefined or unanticipated input is given", () => {
      expect(generateDateRange("I'm not following directions")).toEqual({
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      });
    });
  });
});
