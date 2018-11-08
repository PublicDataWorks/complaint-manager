import { GET_REFERRAL_LETTER_SUCCESS } from "../../../sharedUtilities/constants";
import referralLetterReducer from "./referralLetterReducer";
import {
  getLetterPreviewSuccess,
  getReferralLetterSuccess
} from "../../actionCreators/letterActionCreators";

describe("referralLetterReducer", () => {
  describe("initial state", () => {
    test("returns initial state", () => {
      const newState = referralLetterReducer(undefined, {});
      expect(newState).toEqual({
        letterDetails: {},
        letterHtml: "",
        addresses: {},
        edited: false
      });
    });
  });

  describe("GET_REFERRAL_LETTER_SUCCESS", () => {
    test("sets the letter details in state", () => {
      const letterDetails = { id: 6, letterOfficers: [] };
      const newState = referralLetterReducer(
        undefined,
        getReferralLetterSuccess(letterDetails)
      );
      expect(newState).toEqual({
        letterDetails,
        letterHtml: "",
        addresses: {},
        edited: false
      });
    });
  });

  describe("GET_LETTER_PREVIEW_SUCCESS", () => {
    test("sets the letter html", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        edited: false
      };
      let referralLetterAddresses = {
        recipient: "recipient",
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      const newState = referralLetterReducer(
        initialState,
        getLetterPreviewSuccess(
          "new letter html",
          referralLetterAddresses,
          true
        )
      );
      expect(newState).toEqual({
        letterDetails: "something",
        letterHtml: "new letter html",
        addresses: referralLetterAddresses,
        edited: true
      });
    });
  });
});
