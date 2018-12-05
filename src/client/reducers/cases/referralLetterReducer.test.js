import {
  GET_FINAL_PDF_URL_SUCCESS,
  GET_LETTER_PDF_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS,
  LETTER_TYPE
} from "../../../sharedUtilities/constants";
import referralLetterReducer from "./referralLetterReducer";
import {
  getFinalPdfUrlSuccess,
  getLetterPdfSuccess,
  getLetterPreviewSuccess,
  getReferralLetterSuccess
} from "../../actionCreators/letterActionCreators";
import timekeeper from "timekeeper";

describe("referralLetterReducer", () => {
  describe("initial state", () => {
    test("returns initial state", () => {
      const newState = referralLetterReducer(undefined, {});
      expect(newState).toEqual({
        letterDetails: {},
        letterHtml: "",
        addresses: {},
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null,
        finalPdfUrl: null
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
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null,
        finalPdfUrl: null
      });
    });
  });

  describe("GET_LETTER_PREVIEW_SUCCESS", () => {
    test("sets the letter html and edit history", () => {
      const timeOfEdit = new Date("2018-07-01 19:00:22 CDT");
      timekeeper.freeze(timeOfEdit);
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null,
        finalPdfUrl: "url"
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
          LETTER_TYPE.EDITED,
          timeOfEdit,
          "final_filename.pdf",
          "draft_filename.pdf"
        )
      );
      expect(newState).toEqual({
        letterDetails: "something",
        letterHtml: "new letter html",
        addresses: referralLetterAddresses,
        letterType: LETTER_TYPE.EDITED,
        lastEdited: timeOfEdit,
        finalFilename: "final_filename.pdf",
        draftFilename: "draft_filename.pdf",
        letterPdf: null,
        finalPdfUrl: "url"
      });
    });
  });

  describe("GET_LETTER_PDF_SUCCESS", () => {
    test("saves the letter pdf in state", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null,
        finalPdfUrl: "url"
      };
      const newState = referralLetterReducer(
        initialState,
        getLetterPdfSuccess("letter pdf")
      );
      const expectedState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: "letter pdf",
        finalPdfUrl: "url"
      };
      expect(newState).toEqual(expectedState);
    });
  });

  describe("GET_FINAL_PDF_URL_SUCCESS", () => {
    test("sets the pdf url", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null,
        finalPdfUrl: null
      };
      const newState = referralLetterReducer(
        initialState,
        getFinalPdfUrlSuccess("url")
      );
      const expectedState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        letterType: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null,
        finalPdfUrl: "url"
      };
      expect(newState).toEqual(expectedState);
    });
  });
});
