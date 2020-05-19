import * as countComplaintsByComplainantType from "./countComplaintsByComplainantType";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

describe("countComplaintsByComplainantType data transformer", () => {
  test("should transform the rawData from the handler for the visualization component", () => {
    const rawData = [
      { complainantType: "Civilian Within NOPD (CN)" },
      { complainantType: "Civilian (CC)" },
      { complainantType: "Civilian (CC)" },
      { complainantType: "Civilian (CC)" },
      { complainantType: "Anonymous (AC)" },
      { complainantType: "Anonymous (AC)" },
      { complainantType: "Police Officer (PO)" },
      { complainantType: "Police Officer (PO)" }
    ];

    const transformedData = countComplaintsByComplainantType.transformData(
      rawData
    );

    const expectedTransformedData = {
      data: {
        type: "pie",
        labels: [
          "Civilian (CC)",
          "Anonymous (AC)",
          "Police Officer (PO)",
          "Civilian Within NOPD (CN)"
        ],
        values: [3, 2, 2, 1],
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
