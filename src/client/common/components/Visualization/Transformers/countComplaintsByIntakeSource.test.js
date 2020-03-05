import * as countComplaintsByIntakeSource from "./countComplaintsByIntakeSource";

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
        labels: ["Email", "Facebook", "Other"],
        values: [2, 5, 3]
      },
      layout: {
        height: 500,
        margin: 20,
        title: "Complaints by Intake Source",
        width: 500
      }
    };

    expect(transformedData).toEqual(expectedTransformedData);
  });
});
