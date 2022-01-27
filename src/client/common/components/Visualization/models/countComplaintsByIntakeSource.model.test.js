import CountComplaintsByIntakeSource from "./countComplaintsByIntakeSource.model";
import { COLORS } from "../dataVizStyling";

describe("CountComplaintsByIntakeSource model", () => {
  describe("data transformer", () => {
    test("should transform the rawData from the handler for the visualization component", () => {
      const rawData = [
        { count: "2", name: "Email" },
        { count: "5", name: "Facebook" },
        { count: "3", name: "Other" }
      ];

      const transformedData = new CountComplaintsByIntakeSource().transformData(
        rawData
      );

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
});
