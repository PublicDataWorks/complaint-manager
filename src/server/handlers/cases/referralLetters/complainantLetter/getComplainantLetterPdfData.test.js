import getComplainantLetterPdfData from "./getComplainantLetterPdfData";

describe("getComplainantLetterPdfData", () => {
  test("should break down complainant data even if the letter type cannot be found", async () => {
    const result = await getComplainantLetterPdfData({
      firstName: "Bob",
      lastName: "Loblaw",
      personTypeDetails: {
        key: "OFFICER",
        description: "officer",
        employeeDescription: "Officer",
        isEmployee: true,
        abbreviation: "OFF"
      }
    });

    expect(result).toEqual({
      recipientFirstName: "Bob",
      recipientLastName: "Loblaw",
      complainantAddress: null,
      complainantEmail: null,
      title: "",
      complainantPersonType: "officer",
      senderName: ""
    });
  });
});
