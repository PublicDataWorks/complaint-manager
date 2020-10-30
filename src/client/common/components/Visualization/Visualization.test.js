import {
  QUERY_TYPES,
  DATE_RANGE_TYPE
} from "../../../../sharedUtilities/constants";
import { PlotlyWrapper } from "./PlotlyWrapper";
import React from "react";
import { act, render } from "@testing-library/react";
import Visualization from "./Visualization";
import { getVisualizationData } from "./getVisualizationData";

jest.mock("./PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

const MOCK_DATA = {
  CC: 1
};
const MOCK_LAYOUT = {};
jest.mock("./getVisualizationData", () => ({
  getVisualizationData: jest.fn(queryType => ({
    data: MOCK_DATA,
    layout: MOCK_LAYOUT
  }))
}));

describe("Visualization", () => {
  test("should pass correct data and layout options to PlotlyWrapper", async () => {
    const options = { dateRangeType: DATE_RANGE_TYPE.PAST_12_MONTHS };
    // Act
    await act(async () => {
      render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
          queryOptions={options}
        />
      );
    });

    // Assert
    expect(getVisualizationData).toHaveBeenCalledWith(
      QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE,
      expect.objectContaining(options)
    );
    expect(PlotlyWrapper).toHaveBeenCalledWith(
      {
        data: MOCK_DATA,
        layout: MOCK_LAYOUT
      },
      {}
    );
  });
});
