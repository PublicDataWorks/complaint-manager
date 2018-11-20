import {
  GET_LETTER_PDF_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS
} from "../../../sharedUtilities/constants";
import referralLetterReducer from "./referralLetterReducer";
import {
  getLetterPdfSuccess,
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
        editHistory: { edited: false },
        letterPdf: null
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
        editHistory: { edited: false },
        letterPdf: null
      });
    });
  });

  describe("GET_LETTER_PREVIEW_SUCCESS", () => {
    test("sets the letter html", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editHistory: { edited: false },
        letterPdf: null
      };
      let referralLetterAddresses = {
        recipient: "recipient",
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      const newState = referralLetterReducer(
        initialState,
        getLetterPreviewSuccess("new letter html", referralLetterAddresses, {
          edited: true
        })
      );
      expect(newState).toEqual({
        letterDetails: "something",
        letterHtml: "new letter html",
        addresses: referralLetterAddresses,
        editHistory: { edited: true },
        letterPdf: null
      });
    });
  });

  describe("GET_LETTER_PDF_SUCCESS", () => {
    test("saves the letter pdf in state", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editHistory: { edited: false },
        letterPdf: null
      };
      const newState = referralLetterReducer(
        initialState,
        getLetterPdfSuccess("letter pdf")
      );
      const expectedState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editHistory: { edited: false },
        letterPdf: "letter pdf"
      };
      expect(newState).toEqual(expectedState);
    });
  });
});
