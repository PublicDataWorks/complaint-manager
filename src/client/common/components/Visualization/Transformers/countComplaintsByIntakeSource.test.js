import * as countComplaintsByIntakeSource from "./countComplaintsByIntakeSource";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

describe("countComplaintsByIntakeSource Data transformer", () => {
  test("should transform the rawData from the handler for the visualization component", () => {
    const rawData = [
      { cases: "2", name: "Email" },
      { cases: "5", name: "Facebook" },
      { cases: "3", name: "Other" }
    ];

    const transformedData = countComplaintsByIntakeSource.transformData(
      rawData
    );

    const expectedTransformedData = {
      data: {
        type: "pie",
        labels: ["Facebook", "Other", "Email"],
        values: [5, 3, 2],
        marker: {
          colors: COLORS
        },
        hoverinfo: "label+percent",
        textinfo: "label+value",
        textposition: "outside",
        hole: 0.5
      },
      layout: {
        title: {
          text: "Complaints by Intake Source",
          font: TITLE_FONT
        },
        height: 500,
        width: 800,
        annotations: generateDonutCenterAnnotations(10),
        showlegend: false,
        font: LABEL_FONT
      }
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });
});
