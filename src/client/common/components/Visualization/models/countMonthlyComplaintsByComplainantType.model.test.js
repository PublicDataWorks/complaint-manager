import CountMonthlyComplaintsByComplainantType, {
  enableCountHighlight,
  enableDateHighlight
} from "./countMonthlyComplaintsByComplainantType.model";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("CountMonthlyComplaintsByComplainantType model", () => {
  let model = new CountMonthlyComplaintsByComplainantType();
  describe("data transformation", () => {
    let rawData = {
      [PERSON_TYPE.CIVILIAN.abbreviation]: [
        {
          date: "Jun 19",
          count: 1
        },
        {
          date: "Jul 19",
          count: 4
        }
      ],
      [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: [
        {
          date: "Jun 19",
          count: 8
        },
        {
          date: "Jul 19",
          count: 10
        }
      ],
      [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: [
        {
          date: "Jun 19",
          count: 3
        },
        {
          date: "Jul 19",
          count: 2
        }
      ],
      AC: [
        {
          date: "Jun 19",
          count: 0
        },
        {
          date: "Jul 19",
          count: 7
        }
      ]
    };

    test("should determine y-maximum as rounded 10% units higher than highest count", () => {
      const { maximum } = model.transformData(rawData).data.pop() || {};

      expect(maximum).toEqual(12);
    });

    test("should highlight within the date range", () => {
      const ccDateHighlight = enableDateHighlight(
        rawData[PERSON_TYPE.CIVILIAN.abbreviation]
      );

      expect(ccDateHighlight).toEqual(["Jun 19", "Jul 19", "Jul 19", "Jun 19"]);
    });

    test("should highlight within the count range", () => {
      const maximum = 12;
      const poCountHighlight = enableCountHighlight(
        rawData[PERSON_TYPE.KNOWN_OFFICER.abbreviation],
        maximum
      );

      expect(poCountHighlight).toEqual([8.3, 10.3, 9.7, 7.7]);
    });
  });
});
