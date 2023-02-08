import getComplainantLetterPdfData from "./getComplainantLetterPdfData";

const {
  DEFAULT_PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

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
      complainantPersonType: DEFAULT_PERSON_TYPE.description,
      senderName: ""
    });
  });
});
