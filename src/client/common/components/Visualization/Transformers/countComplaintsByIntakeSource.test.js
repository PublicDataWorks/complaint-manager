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
      { count: "2", name: "Email" },
      { count: "5", name: "Facebook" },
      { count: "3", name: "Other" }
    ];

    const transformedData = countComplaintsByIntakeSource.transformData(rawData);

    const expectedTransformedData = {
      data: [
        {
          type: "pie",
          labels: ["Facebook", "Other", "Email"],
          values: [5, 3, 2],
          count: 10,
          marker: {
            colors: COLORS
          },
          hoverinfo: "label+percent",
          textinfo: "label+value",
          textposition: "outside",
          hole: 0.5
        }
      ]
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });
});
