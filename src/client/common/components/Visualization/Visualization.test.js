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

const MOCK_LAYOUT = {};
jest.mock("./getAggregateVisualizationLayout", () => ({
    getAggregateVisualizationLayout: jest.fn(() => (MOCK_LAYOUT))
}));

describe("Visualization", () => {
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
    const lastCall = PlotlyWrapper.mock.calls.length - 1;
    expect(PlotlyWrapper.mock.calls[lastCall][0]).toMatchObject(
      {
          data: MOCK_DATA,
          layout: MOCK_LAYOUT
      }
    );
  });
});
