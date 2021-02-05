import {
  QUERY_TYPES,
  DATE_RANGE_TYPE
} from "../../../../sharedUtilities/constants";
import { PlotlyWrapper } from "./PlotlyWrapper";
import React from "react";
import { act, render } from "@testing-library/react";
import Visualization from "./Visualization";
import { getVisualizationData } from "./getVisualizationData";
import { getAggregateVisualizationLayout } from "./getAggregateVisualizationLayout";
import mediaQuery from "css-mediaquery";

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

jest.mock("./getVisualizationData", () => ({
  getVisualizationData: jest.fn(queryType => ({
    data: MOCK_DATA
  }))
}));

const MOCK_CONFIG = {
  responsive: true,
  useResizeHandler: true
};

const MOCK_STYLE = {
  height: "100%",
  width: "100%"
}

const MOCK_LAYOUT = {};
const MOCK_MOBILE_LAYOUT = { mobileLayout: true };

jest.mock("./getAggregateVisualizationLayout", () => ({
  getAggregateVisualizationLayout: jest.fn(options => {
    return options.isMobile ? MOCK_MOBILE_LAYOUT : MOCK_LAYOUT;
  })
}));

describe("Visualization", () => {
  beforeEach(() => {
    window.matchMedia = createMatchMedia(1000);
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

    expect(getVisualizationData).toHaveBeenCalledTimes(1);

    const lastCall = PlotlyWrapper.mock.calls.length - 1;
    expect(PlotlyWrapper.mock.calls[lastCall][0]).toEqual({
      style: MOCK_STYLE,
      config: MOCK_CONFIG,
      data: MOCK_DATA,
      layout: MOCK_MOBILE_LAYOUT
    });
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
    expect(getVisualizationData).toHaveBeenCalledWith(
      expect.objectContaining({
        queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE,
        queryOptions
      })
    );
      expect(getAggregateVisualizationLayout).toHaveBeenCalledWith(
          expect.objectContaining({
              queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE,
              queryOptions,
              newData: expect.objectContaining({data: MOCK_DATA})
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
});
