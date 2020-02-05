import { mount } from "enzyme";
import createConfiguredStore from "../../../createConfiguredStore";
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
} from "../../../../sharedUtilities/constants";

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
      expect(wrapper.find(OfficerSearchResultsRow).exists()).toBeTrue();
    });

    test("should not render Anonymous checkbox", () => {
      expect(
        wrapper.find('[data-testid="isOfficerAnonymous"]').exists()
      ).toBeFalse();
    });

    test("should display proper button text", () => {
      expect(
        wrapper
          .find('[data-testid="officerSubmitButton"]')
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
    test("should not show contact information fields if officer is an accused", () => {
      expect(
        wrapper.find('[data-testid="phoneNumberField"]').exists()
      ).toBeFalse();
      expect(wrapper.find('[data-testid="emailField"]').exists()).toBeFalse();
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
            contactInformationFeature={true}
          />
        </Router>
      </Provider>
    );

    test("should render Change Officer", () => {
      expect(
        wrapper.find('[data-testid="unknownOfficerMessage"]').exists()
      ).toBeTrue();
    });

    test("should hide the Anonymous checkbox", () => {
      expect(
        wrapper.find('[data-testid="isOfficerAnonymous"]').exists()
      ).toBeFalse();
    });

    test("should pass caseId and officerSearchUrl to ChangeOfficer component", () => {
      expect(wrapper.find(ChangeOfficer).prop("caseId")).toBe(testCaseId);
      expect(wrapper.find(ChangeOfficer).prop("officerSearchUrl")).toBe(
        mockSearchUrl
      );
    });
    test("should show contact information fields if officer is a Unknown and not accused", () => {
      expect(
        wrapper.find('[data-testid="phoneNumberField"]').exists()
      ).toBeTrue();
      expect(wrapper.find('[data-testid="emailField"]').exists()).toBeTrue();
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
            initialRoleOnCase={COMPLAINANT}
            contactInformationFeature={true}
          />
        </Router>
      </Provider>
    );

    test("should show the Anonymous checkbox", () => {
      expect(
        wrapper.find('[data-testid="isOfficerAnonymous"]').exists()
      ).toBeTrue();
    });

    test("should show contact information fields if officer is a complainant", () => {
      expect(
        wrapper.find('[data-testid="phoneNumberField"]').exists()
      ).toBeTrue();
      expect(wrapper.find('[data-testid="emailField"]').exists()).toBeTrue();
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
            initialRoleOnCase={WITNESS}
            contactInformationFeature={true}
          />
        </Router>
      </Provider>
    );

    test("should show the Anonymous checkbox", () => {
      expect(wrapper.exists('[data-testid="isOfficerAnonymous"]')).toBeTrue();
    });
    test("should show contact information fields if officer is a witness", () => {
      expect(wrapper.exists('[data-testid="phoneNumberField"]')).toBeTrue();
      expect(wrapper.exists('[data-testid="emailField"]')).toBeTrue();
    });
  });
});
