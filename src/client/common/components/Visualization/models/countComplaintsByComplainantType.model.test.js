import CountComplaintsByComplainantType from "./countComplaintsByComplainantType.model";
import { COLORS } from "../dataVizStyling";

describe("countComplaintsByComplainantType model", () => {
  describe("data transformer", () => {
    test("should transform the rawData from the handler for the visualization component", () => {
      const rawData = {
        legendValue: 1,
        anotherLegendValue: 2,
        aFinalLegendValue: 3
      };

      const transformedData =
        new CountComplaintsByComplainantType().transformData(rawData);

      let x = 0;
      const expectedTransformedData = {
        data: [
          {
            type: "pie",
            labels: ["aFinalLegendValue", "anotherLegendValue", "legendValue"],
            values: [3, 2, 1],
            count: 6,
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

      for (let i = 0; i < x; i++) {
        expectedTransformedData.data[0].values.pop();
      }

      expect(transformedData).toEqual(expectedTransformedData);
    });
  });
});
