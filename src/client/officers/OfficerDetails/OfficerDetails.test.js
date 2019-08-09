import { shallow } from "enzyme";
import { mount } from "enzyme/build/index";
import createConfiguredStore from "../../createConfiguredStore";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import OfficerDetails from "./OfficerDetails";
import OfficerSearchResultsRow from "../OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow";
import { ChangeOfficer } from "../OfficerSearch/OfficerSearchResults/officerSearchResultsRowButtons";
import { initialize } from "redux-form";
import { selectOfficer } from "../../actionCreators/officersActionCreators";
import {
  ACCUSED,
  COMPLAINANT,
  OFFICER_DETAILS_FORM_NAME,
  WITNESS
} from "../../../sharedUtilities/constants";

jest.mock("../thunks/addOfficer", () => (caseId, officerId, values) => ({
  type: "MOCK_ADD_OFFICER_ACTION",
  caseId,
  officerId,
  values
}));

const store = createConfiguredStore();

test("should dispatch thunk with correct stuff when unknown officer selected", () => {
  const mockOfficerSearchUrl = "/mock-officer-search-url";
  const expectedValues = { roleOnCase: ACCUSED };
  const caseId = 12;
  const submitAction = jest.fn(values => ({ type: "MOCK_THUNK", values }));

  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");

  store.dispatch(
    initialize(OFFICER_DETAILS_FORM_NAME, { roleOnCase: ACCUSED })
  );
  store.dispatch(selectOfficer({}));

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={submitAction}
          officerSearchUrl={mockOfficerSearchUrl}
          caseId={caseId}
          dispatch={dispatchSpy}
          selectedOfficer={expectedValues}
        />
      </Router>
    </Provider>
  );

  const submitButton = wrapper.find('button[data-test="officerSubmitButton"]');

  submitButton.simulate("click");

  expect(dispatchSpy).toHaveBeenCalledWith(submitAction(expectedValues));
});

describe("OfficerDetails when there is a selected officer", () => {
  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"ButtonXyz"}
          submitAction={() => ({})}
          officerSearchUrl={"<search url>"}
          caseId={5}
          dispatch={() => ({})}
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
    ).toContain("ButtonXyz");
  });

  test("should pass caseId and officerSearchUrl to ChangeOfficer component", () => {
    expect(wrapper.find(ChangeOfficer).prop("caseId")).toBe(5);
    expect(wrapper.find(ChangeOfficer).prop("officerSearchUrl")).toBe(
      "<search url>"
    );
  });
});

describe("OfficerDetails when there is no selectedOfficer", () => {
  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={() => ({})}
          officerSearchUrl={"<officer url>"}
          caseId={10}
          dispatch={() => ({})}
          initialRoleOnCase={null}
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
    expect(wrapper.find(ChangeOfficer).prop("caseId")).toBe(10);
    expect(wrapper.find(ChangeOfficer).prop("officerSearchUrl")).toBe(
      "<officer url>"
    );
  });
});

describe("OfficerDetails when selectedOfficer is a COMPLAINANT", () => {
  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={() => ({})}
          officerSearchUrl={"<officer url>"}
          caseId={10}
          dispatch={() => ({})}
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
          submitButtonText={"Button"}
          submitAction={() => ({})}
          officerSearchUrl={"<officer url>"}
          caseId={10}
          dispatch={() => ({})}
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
