import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import { PlotlyWrapper } from "./PlotlyWrapper";
import React from "react";
import { act, render } from "@testing-library/react";
import Visualization from "./Visualization";
import axios from "axios";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "./dataVizStyling";

jest.mock("./PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});
jest.mock("axios");

describe("Visualization", () => {
  test("should pass correct data and layout options to PlotlyWrapper", async () => {
    // Arrange
    const responseBody = {
      data: [
        { cases: "2", name: "Email" },
        { cases: "5", name: "Facebook" },
        { cases: "3", name: "Other" }
      ]
    };

    axios.get.mockResolvedValue({ ...responseBody });

    // Act
    await act(async () => {
      render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
        />
      );
    });

    // Assert
    expect(PlotlyWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            labels: expect.arrayContaining(["Email", "Facebook", "Other"]),
            type: "pie",
            values: expect.arrayContaining([2, 5, 3]),
            marker: {
              colors: COLORS
            },
            hoverinfo: "label+percent",
            textinfo: "label+value",
            textposition: "outside",
            hole: 0.5
          })
        ]),
        layout: expect.objectContaining({
          title: {
            text: "Complaints by Intake Source",
            font: TITLE_FONT
          },
          height: 600,
          width: 800,
          margin: {
            b: 170
          },
          annotations: generateDonutCenterAnnotations(10),
          showlegend: false,
          font: LABEL_FONT
        })
      }),
      {}
    );
  });
});
