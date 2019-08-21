import { mount } from "enzyme";
import createConfiguredStore from "../../createConfiguredStore";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import OfficerDetails from "./OfficerDetails";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";
import {
  ACCUSED,
  COMPLAINANT,
  WITNESS
} from "../../../sharedUtilities/constants";

const store = createConfiguredStore();
const testCaseId = 1;
const stubFunction = () => ({});
const mockSearchUrl = "<search url>";
const mockButtonText = "ButtonXyz";

describe("OfficerDetails", () => {
  describe("OfficerDetails when there is a selected officer", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerDetails
            submitButtonText={mockButtonText}
            submitAction={stubFunction}
            officerSearchUrl={mockSearchUrl}
            caseId={testCaseId}
            dispatch={stubFunction}
            selectedOfficer={{
              roleOnCase: ACCUSED
            }}
          />
        </Router>
      </Provider>
    );

    test("should render Officer Search Result Row", () => {
      expect(wrapper.find(OfficerSearchResultsRow).exists()).toBeTruthy();
    });

    test("should not render Anonymous checkbox", () => {
      expect(
        wrapper.find('[data-test="isOfficerAnonymous"]').exists()
      ).toBeFalsy();
    });

    test("should display proper button text", () => {
      expect(
        wrapper
          .find('[data-test="officerSubmitButton"]')
          .first()
          .html()
      ).toContain(mockButtonText);
    });

    test("should pass caseId and officerSearchUrl to ChangeOfficer component", () => {
      expect(wrapper.find(ChangeOfficer).prop("caseId")).toBe(testCaseId);
      expect(wrapper.find(ChangeOfficer).prop("officerSearchUrl")).toBe(
        mockSearchUrl
      );
    });
  });

  describe("OfficerDetails when there is an unknown officer selected", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerDetails
            submitButtonText={mockButtonText}
            submitAction={stubFunction}
            officerSearchUrl={mockSearchUrl}
            caseId={testCaseId}
            dispatch={stubFunction}
            initialRoleOnCase={COMPLAINANT}
          />
        </Router>
      </Provider>
    );

    test("should render Change Officer", () => {
      expect(
        wrapper.find('[data-test="unknownOfficerMessage"]').exists()
      ).toBeTruthy();
    });

    test("should hide the Anonymous checkbox", () => {
      expect(
        wrapper.find('[data-test="isOfficerAnonymous"]').exists()
      ).toBeFalsy();
    });

    test("should pass caseId and officerSearchUrl to ChangeOfficer component", () => {
      expect(wrapper.find(ChangeOfficer).prop("caseId")).toBe(testCaseId);
      expect(wrapper.find(ChangeOfficer).prop("officerSearchUrl")).toBe(
        mockSearchUrl
      );
    });
  });

  describe("OfficerDetails when selectedOfficer is a COMPLAINANT", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerDetails
            submitButtonText={mockButtonText}
            submitAction={stubFunction}
            officerSearchUrl={mockSearchUrl}
            caseId={testCaseId}
            dispatch={stubFunction}
            selectedOfficerData={false}
            selectedOfficer={{
              roleOnCase: COMPLAINANT
            }}
          />
        </Router>
      </Provider>
    );

    test("should show the Anonymous checkbox", () => {
      expect(wrapper.find('[data-test="isOfficerAnonymous"]')).toBeTruthy();
    });
  });

  describe("OfficerDetails when selectedOfficer is a WITNESS", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerDetails
            submitButtonText={mockButtonText}
            submitAction={stubFunction}
            officerSearchUrl={mockSearchUrl}
            caseId={testCaseId}
            dispatch={stubFunction}
            selectedOfficerData={false}
            selectedOfficer={{
              roleOnCase: WITNESS
            }}
          />
        </Router>
      </Provider>
    );

    test("should show the Anonymous checkbox", () => {
      expect(wrapper.find('[data-test="isOfficerAnonymous"]')).toBeTruthy();
    });
  });
});
