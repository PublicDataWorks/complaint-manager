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
          hoverinfo: "none"
        }
      ],
      layout: {
        barmode: "group",
        xaxis: {
          showgrid: false,
          zeroline: false,
          automargin: true,
          showticklabels: false
        },
        title: {
          text: "Top Tags<br><sub>Past 12 Months",
          font: TITLE_FONT
        },
        width: 750,
        margin: {
          l: 235,
          r: 0,
          b: 70,
          t: 130,
          pad: 8
        },
        font: LABEL_FONT
      }
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });
});
