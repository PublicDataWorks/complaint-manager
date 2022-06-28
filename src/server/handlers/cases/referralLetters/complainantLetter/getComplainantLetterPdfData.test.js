import getComplainantLetterPdfData from "./getComplainantLetterPdfData";

describe("getComplainantLetterPdfData", () => {
  test("should break down complainant data even if the letter type cannot be found", async () => {
    const result = await getComplainantLetterPdfData({
      firstName: "Bob",
      lastName: "Loblaw"
    });

    expect(result).toEqual({
      recipientFirstName: "Bob",
      recipientLastName: "Loblaw",
      complainantAddress: null,
      complainantEmail: null,
      title: "",
      complainantPersonType: "Civilian",
      senderName: ""
    });
  });
});
