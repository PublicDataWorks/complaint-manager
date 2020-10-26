import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import { PlotlyWrapper } from "./PlotlyWrapper";
import React from "react";
import { act, render } from "@testing-library/react";
import Visualization from "./Visualization";

jest.mock("./PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

const MOCK_DATA = {
  CC: 1
};
const MOCK_LAYOUT = {};
jest.mock("./getVisualizationData", () => ({
  getVisualizationData: jest.fn((queryType, isPublic) => ({
    data: MOCK_DATA,
    layout: MOCK_LAYOUT
  }))
}));

describe("Visualization", () => {
  test("should pass correct data and layout options to PlotlyWrapper", async () => {
    // Act
    await act(async () => {
      render(<Visualization queryType={QUERY_TYPES.COUNT_TOP_10_TAGS} />);
    });

    // Assert
    expect(PlotlyWrapper).toHaveBeenCalledWith(
      {
        data: MOCK_DATA,
        layout: MOCK_LAYOUT
      },
      {}
    );
  });
});
