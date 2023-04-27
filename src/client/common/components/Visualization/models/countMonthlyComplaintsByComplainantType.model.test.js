import CountMonthlyComplaintsByComplainantType, {
  enableCountHighlight,
  enableDateHighlight
} from "./countMonthlyComplaintsByComplainantType.model";

describe("CountMonthlyComplaintsByComplainantType model", () => {
  let model = new CountMonthlyComplaintsByComplainantType();
  describe("data transformation", () => {
    let rawData = {
      ["Person who will remain nameless"]: [
        {
          date: "Jun 19",
          count: 1
        },
        {
          date: "Jul 19",
          count: 4
        }
      ],
      ["Person whose name I know but refuse to tell you"]: [
        {
          date: "Jun 19",
          count: 8
        },
        {
          date: "Jul 19",
          count: 10
        }
      ],
      ["Person whose name is universally known"]: [
        {
          date: "Jun 19",
          count: 3
        },
        {
          date: "Jul 19",
          count: 2
        }
      ],
      "Anonymous (AC)": [
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
        rawData["Person who will remain nameless"]
      );

      expect(ccDateHighlight).toEqual(["Jun 19", "Jul 19", "Jul 19", "Jun 19"]);
    });

    test("should highlight within the count range", () => {
      const maximum = 12;
      const poCountHighlight = enableCountHighlight(
        rawData["Person whose name I know but refuse to tell you"],
        maximum
      );

      expect(poCountHighlight).toEqual([8.3, 10.3, 9.7, 7.7]);
    });
  });
});
