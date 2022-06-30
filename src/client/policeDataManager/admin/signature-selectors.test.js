import { getFilteredUserEmails } from "./signature-selectors";

describe("Signature Selectors", () => {
  describe("getFilteredUserEmails", () => {
    test("should return user emails that do not correspond with signer emails", () => {
      const state = {
        users: {
          all: [
            { email: "abc@ghi.com" },
            { email: "bbc@ghi.com" },
            { email: "cbc@ghi.com" },
            { email: "dbc@ghi.com" },
            { email: "ebc@ghi.com" },
            { email: "fbc@ghi.com" }
          ]
        }
      };

      const props = {
        signers: [
          { nickname: "abc@ghi.com" },
          { nickname: "cbc@ghi.com" },
          { nickname: "fbc@ghi.com" }
        ]
      };

      expect(getFilteredUserEmails(state, props)).toEqual([
        "bbc@ghi.com",
        "dbc@ghi.com",
        "ebc@ghi.com"
      ]);
    });
  });
});
