import { allegationFormNormalizer } from "./reduxFormNormalizers";

describe("reduxFormNormalizers", () => {
  describe("allegationFormNormalizer", () => {
    test("trims whitespace from the directive", () => {
      const values = { directive: "    test    " };
      const actualValues = allegationFormNormalizer(values);

      expect(actualValues.directive).toEqual("test");
    });
  });
});
