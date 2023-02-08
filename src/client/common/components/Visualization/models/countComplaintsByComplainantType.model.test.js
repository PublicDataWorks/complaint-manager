import CountComplaintsByComplainantType from "./countComplaintsByComplainantType.model";
import { COLORS } from "../dataVizStyling";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("countComplaintsByComplainantType model", () => {
  describe("data transformer", () => {
    test("should transform the rawData from the handler for the visualization component", () => {
      const rawData = Object.values(PERSON_TYPE).reduce(
        (acc, type) => {
          acc[type.abbreviation] = 1;
          return acc;
        },
        {
          AC: 1
        }
      );

      const transformedData =
        new CountComplaintsByComplainantType().transformData(rawData);

      const expectedTransformedData = {
        data: [
          {
            type: "pie",
            labels: Object.values(PERSON_TYPE).reduce(
              (acc, type) => {
                return [...acc, type.publicLegendValue];
              },
              ["Anonymous (AC)"]
            ),
            values: Object.values(PERSON_TYPE).reduce(
              (acc, type) => {
                return [...acc, 1];
              },
              [1]
            ),
            count: Object.values(PERSON_TYPE).length + 1,
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
