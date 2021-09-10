import * as countComplaintsByComplainantType from "./countComplaintsByComplainantType";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "../dataVizStyling";

const { PD, PERSON_TYPE } = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("countComplaintsByComplainantType data transformer", () => {
  test("should transform the rawData from the handler for the visualization component", () => {
    const rawData = {
      [PERSON_TYPE.CIVILIAN.abbreviation]: 3,
      [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: 2,
      [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: 2,
      AC: 1
    };

    const transformedData =
      countComplaintsByComplainantType.transformData(rawData);

    const expectedTransformedData = {
      data: [
        {
          type: "pie",
          labels: [
            `Civilian (${PERSON_TYPE.CIVILIAN.abbreviation})`,
            `Police Officer (${PERSON_TYPE.KNOWN_OFFICER.abbreviation})`,
            `Civilian ${PD} Employee (${PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation})`,
            "Anonymous (AC)"
          ],
          values: [3, 2, 2, 1],
          count: 8,
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
