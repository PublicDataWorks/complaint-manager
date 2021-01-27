import * as countTop10Tags from "./countTop10Tags";
import { COLORS, LABEL_FONT, TITLE_FONT } from "../dataVizStyling";

describe("countTop10Tags Data Transformer", () => {
  test("should transform the rawData from the handler for the visualization component", () => {
    const rawData = [
      {
        name: "karancitoooooo",
        count: "1"
      },
      {
        name: "sabs",
        count: "1"
      },
      {
        name: "Tofu",
        count: "2"
      },
      {
        name: "Chicago hot dogs",
        count: "3"
      }
    ];

    const transformedData = countTop10Tags.transformData(rawData);

    const expectedTransformedData = {
      data: [
        {
          x: ["3", "2", "1", "1"],
          y: ["Chicago hot dogs", "Tofu", "sabs", "karancitoooooo"],
          type: "bar",
          width: 0.75,
          orientation: "h",
          marker: {
            color: COLORS[0]
          },
          text: ["3", "2", "1", "1"],
          textposition: "auto",
          textangle: 0,
          hovertext: ["Chicago hot dogs", "Tofu", "sabs", "karancitoooooo"],
          hoverinfo: "text"
        }
      ]
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });

  test("should truncate long values on y-axis and retain full values for hovertext for the visualization component", () => {
    const rawData = [
      {
        name: "Chicago deep dish pizza",
        count: "1"
      },
      {
        name: "Tofu",
        count: "1"
      },
      {
        name: "The Museum of Science and Industry",
        count: "2"
      },
      {
        name: "Cars",
        count: "3"
      }
    ];

    const transformedData = countTop10Tags.transformData(rawData);

    const expectedTransformedData = {
      data: [
        {
          x: ["3", "2", "1", "1"],
          y: [
            "Cars",
            "The Museum of Scienc...",
            "Tofu",
            "Chicago deep dish pi..."
          ],
          type: "bar",
          width: 0.75,
          orientation: "h",
          marker: {
            color: COLORS[0]
          },
          text: ["3", "2", "1", "1"],
          textposition: "auto",
          textangle: 0,
          hovertext: [
            "Cars",
            "The Museum of Science and Industry",
            "Tofu",
            "Chicago deep dish pizza"
          ],
          hoverinfo: "text"
        }
      ]
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });

  test("should handle layout when no data is returned from backend", () => {
    const rawData = [];

    const transformedData = countTop10Tags.transformData(rawData);

    const expectedTransformedData = {
      data: [
        {
          x: [],
          y: [],
          type: "bar",
          width: 0.75,
          orientation: "h",
          marker: {
            color: COLORS[0]
          },
          text: [],
          textposition: "auto",
          textangle: 0,
          hovertext: [],
          hoverinfo: "text"
        }
      ]
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });
});
