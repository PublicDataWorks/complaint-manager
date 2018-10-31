import {
  EDIT_REFERRAL_LETTER_SUCCESS,
  GET_REFERRAL_LETTER_SUCCESS
} from "../../../sharedUtilities/constants";
import referralLetterReducer from "./referralLetterReducer";
import {
  editIAProCorrectionsSuccess,
  editRecommendedActionsSuccess,
  editReferralLetterSuccess,
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
        addresses: {}
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
        addresses: {}
      });
    });
  });

  describe("EDIT_REFERRAL_LETTER_SUCCESS", () => {
    test("sets the letter details in state", () => {
      const letterDetails = { id: 6, letterOfficers: [] };
      const newState = referralLetterReducer(
        undefined,
        editReferralLetterSuccess(letterDetails)
      );
      expect(newState).toEqual({
        letterDetails,
        letterHtml: "",
        addresses: {}
      });
    });
  });

  describe("EDIT_IAPRO_CORRECTIONS_SUCCESS", function() {
    test("sets the iapro corrections details in state", () => {
      const letterDetails = {
        id: 12,
        referralLetterIAProCorrections: [{ id: 4, details: "some details" }]
      };
      const newState = referralLetterReducer(
        undefined,
        editIAProCorrectionsSuccess(letterDetails)
      );
      expect(newState).toEqual({
        letterDetails,
        letterHtml: "",
        addresses: {}
      });
    });
  });

  describe("EDIT_RECOMMENDED_ACTIONS_SUCCESS", function() {
    test("sets the recommended action details in state", () => {
      const letterDetails = {
        id: 15,
        includeRetaliationConcerns: true,
        letterOfficers: [
          {
            id: 1,
            referralLetterOfficerRecommendedActions: [1, 3],
            recommendedActionNotes: "notes"
          }
        ]
      };
      const newState = referralLetterReducer(
        undefined,
        editRecommendedActionsSuccess(letterDetails)
      );
      expect(newState).toEqual({
        letterDetails,
        letterHtml: "",
        addresses: {}
      });
    });
  });

  describe("GET_LETTER_PREVIEW_SUCCESS", () => {
    test("sets the letter html", () => {
      const initialState = {
        letterDetails: "something",
        letterHtml: "something",
        addresses: {}
      };
      let referralLetterAddresses = {
        recipient: "recipient",
        sender: "some sender",
        transcribedBy: "transcriber"
      };
      const newState = referralLetterReducer(
        initialState,
        getLetterPreviewSuccess("new letter html", referralLetterAddresses)
      );
      expect(newState).toEqual({
        letterDetails: "something",
        letterHtml: "new letter html",
        addresses: referralLetterAddresses
      });
    });
  });
});
