import * as countComplaintsByComplainantType from "./countComplaintsByComplainantType";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

describe("countComplaintsByComplainantType data transformer", () => {
  test("should transform the rawData from the handler for the visualization component", () => {
    const rawData = {
      CC: 3,
      PO: 2,
      CN: 2,
      AC: 1
    };

    const transformedData = countComplaintsByComplainantType.transformData(
      rawData
    );

    const expectedTransformedData = {
      data: [
        {
          type: "pie",
          labels: [
            "Civilian (CC)",
            "Police Officer (PO)",
            "Civilian NOPD Employee (CN)",
            "Anonymous (AC)"
          ],
          values: [3, 2, 2, 1],
          marker: {
            colors: COLORS
          },
          hoverinfo: "label+percent",
          textinfo: "label+value",
          textposition: "outside",
          hole: 0.5
        }
      ],
      layout: {
        title: {
          text: "Complaints by Complainant Type",
          font: TITLE_FONT
        },
        height: 600,
        width: 800,
        margin: {
          b: 170
        },
        annotations: generateDonutCenterAnnotations(8),
        showlegend: false,
        font: LABEL_FONT
      }
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });
});
