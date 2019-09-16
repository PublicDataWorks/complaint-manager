import {
  GET_REFERRAL_LETTER_PDF_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS,
  EDIT_STATUS
} from "../../../sharedUtilities/constants";
import referralLetterReducer from "./referralLetterReducer";
import {
  getReferralLetterPdfSuccess,
  getReferralLetterPreviewSuccess,
  getReferralLetterEditStatusSuccess,
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
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
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
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null
      });
    });
  });

  describe("GET_REFERRAL_LETTER_PREVIEW_SUCCESS", () => {
    test("sets the letter html and edit history", () => {
      const timeOfEdit = new Date("2018-07-01 19:00:22 CDT");
      timekeeper.freeze(timeOfEdit);
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null
      };
      let referralLetterAddresses = {
        recipient: "name\naddress",
        recipient_field: {
          address: "address",
          name: "name",
        },
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      const newState = referralLetterReducer(
        initialState,
        getReferralLetterPreviewSuccess(
          "new letter html",
          referralLetterAddresses,
          EDIT_STATUS.EDITED,
          timeOfEdit,
          "final_filename.pdf",
          "draft_filename.pdf"
        )
      );
      expect(newState).toEqual({
        letterDetails: "something",
        letterHtml: "new letter html",
        addresses: referralLetterAddresses,
        editStatus: EDIT_STATUS.EDITED,
        lastEdited: timeOfEdit,
        finalFilename: "final_filename.pdf",
        draftFilename: "draft_filename.pdf",
        letterPdf: null
      });
    });
  });

  describe("GET_REFERRAL_LETTER_PDF_SUCCESS", () => {
    test("saves the letter pdf in state", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null
      };
      const newState = referralLetterReducer(
        initialState,
        getReferralLetterPdfSuccess("letter pdf")
      );

      const expectedState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: "letter pdf"
      };
      expect(newState).toEqual(expectedState);
    });
  });

  describe("GET_REFERRAL_LETTER_EDIT_STATUS_SUCCESS", () => {
    test("sets the letter type", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null
      };
      const newState = referralLetterReducer(
        initialState,
        getReferralLetterEditStatusSuccess(EDIT_STATUS.GENERATED)
      );
      const expectedState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editStatus: EDIT_STATUS.GENERATED,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe("address recipient fields", () => {
    test("sets the recipient fields from the recipient string", () => {
      const timeOfEdit = new Date("2018-07-01 19:00:22 CDT");
      timekeeper.freeze(timeOfEdit);
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {},
        editStatus: null,
        lastEdited: null,
        finalFilename: null,
        draftFilename: null,
        letterPdf: null
      };
      let originalReferralLetterAddresses = {
        recipient: "name\naddress",
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      let updatedReferralLetterAddresses = {
        ...originalReferralLetterAddresses, 
        recipient_field: {
          name: "name",
          address: "address",
        }
      }
      let newState = referralLetterReducer(
        initialState,
        getReferralLetterPreviewSuccess(
          "new letter html",
          originalReferralLetterAddresses,
          EDIT_STATUS.EDITED,
          timeOfEdit,
          "final_filename.pdf",
          "draft_filename.pdf"
        )
      );
      expect(newState.addresses).toEqual(updatedReferralLetterAddresses);

      originalReferralLetterAddresses = {
        recipient: "name",
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      updatedReferralLetterAddresses = {
        ...originalReferralLetterAddresses, 
        recipient_field: {
          name: "name",
          address: "",
        }
      }
      newState = referralLetterReducer(
        initialState,
        getReferralLetterPreviewSuccess(
          "new letter html",
          originalReferralLetterAddresses,
          EDIT_STATUS.EDITED,
          timeOfEdit,
          "final_filename.pdf",
          "draft_filename.pdf"
        )
      );
      expect(newState.addresses).toEqual(updatedReferralLetterAddresses);

      originalReferralLetterAddresses = {
        recipient: "",
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      updatedReferralLetterAddresses = {
        ...originalReferralLetterAddresses, 
        recipient_field: {
          name: "",
          address: "",
        }
      }
      newState = referralLetterReducer(
        initialState,
        getReferralLetterPreviewSuccess(
          "new letter html",
          originalReferralLetterAddresses,
          EDIT_STATUS.EDITED,
          timeOfEdit,
          "final_filename.pdf",
          "draft_filename.pdf"
        )
      );
      expect(newState.addresses).toEqual(updatedReferralLetterAddresses);
    });
  });
});
