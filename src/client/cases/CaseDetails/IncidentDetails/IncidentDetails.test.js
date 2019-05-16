import React from "react";
import IncidentDetails from "./IncidentDetails";
import { mount } from "enzyme";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import Case from "../../../testUtilities/case";
import formatDate from "../../../utilities/formatDate";
import editIncidentDetails from "../../thunks/editIncidentDetails";
import {
  changeInput,
  expectEventuallyNotToExist,
  selectDropdownOption
} from "../../../testHelpers";
import { DialogContent } from "@material-ui/core";
import { getClassificationsSuccess } from "../../../actionCreators/classificationActionCreators";
import getClassificationDropdownValues from "../../../classifications/thunks/getClassificationDropdownValues";
import getIntakeSourceDropdownValues from "../../../intakeSources/thunks/getIntakeSourceDropdownValues";
import getHowDidYouHearAboutUsSourceDropdownValues from "../../../howDidYouHearAboutUsSources/thunks/getHowDidYouHearAboutUsSourceDropdownValues";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

jest.mock("../../thunks/editIncidentDetails", () =>
  jest.fn(values => ({
    type: "EDIT_INCIDENT_DETAILS_MOCK_THUNK",
    values
  }))
);

jest.mock(
  "../../../classifications/thunks/getClassificationDropdownValues",
  () =>
    jest.fn(values => ({
      type: "GET_CLASSIFICATION_MOCK",
      values
    }))
);

jest.mock("../../../intakeSources/thunks/getIntakeSourceDropdownValues", () =>
  jest.fn(values => ({ type: "GET_INTAKE_SOURCE_MOCK_THUNK", values }))
);

jest.mock(
  "../../../howDidYouHearAboutUsSources/thunks/getHowDidYouHearAboutUsSourceDropdownValues",
  () =>
    jest.fn(values => ({
      type: "GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCE_MOCK_THUNK",
      values
    }))
);

jest.mock("../CivilianDialog/MapServices/MapService", () => {
  return jest.fn().mockImplementation(() => ({
    healthCheck: callback => {
      callback({ googleAddressServiceIsAvailable: false });
    },

    getSuggestionValue: suggestion => {
      return suggestion.description;
    },

    onFetchSuggestions: (input, callback) => {
      callback([{ description: "200 East Randolph Street, Chicago, IL, US" }]);
    },

    onSuggestionSelected: (suggestion, successCallback, failureCallback) => {
      successCallback({
        streetAddress: "200 E Randolph St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "US"
      });
    }
  }));
});

describe("incident details", () => {
  let incidentDetails,
    currentCase,
    firstContactDate,
    incidentDate,
    incidentTime,
    wrapper,
    dispatchSpy,
    formattedIncidentTime;
  beforeEach(() => {
    const store = createConfiguredStore();

    firstContactDate = "1994-05-01";
    incidentDate = "1994-04-24";
    incidentTime = "14:00:00";
    formattedIncidentTime = "02:00 PM CDT";

    currentCase = new Case.Builder()
      .defaultCase()
      .withFirstContactDate(firstContactDate)
      .withIncidentDate(incidentDate)
      .withIncidentTime(incidentTime)
      .withIncidentLocation(undefined)
      .withClassificationId(12)
      .withDistrict("Second District")
      .withIntakeSourceId(2)
      .build();

    dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(getCaseDetailsSuccess(currentCase));
    store.dispatch(getClassificationsSuccess([["UTD", 0], ["OTB", 12]]));
    wrapper = mount(
      <Provider store={store}>
        <IncidentDetails classes={{}} />
      </Provider>
    );
    incidentDetails = wrapper.find(IncidentDetails);
  });

  test("should display first contact date", () => {
    expect(
      wrapper
        .find('[data-test="firstContactDate"]')
        .first()
        .text()
    ).toEqual(formatDate(firstContactDate));
  });

  test("should display incident Date", () => {
    expect(
      wrapper
        .find('[data-test="incidentDate"]')
        .first()
        .text()
    ).toEqual(formatDate(incidentDate));
  });

  test("should display incident time", () => {
    expect(
      wrapper
        .find('[data-test="incidentTime"]')
        .first()
        .text()
    ).toEqual(formattedIncidentTime);
  });

  test("should display incident location", () => {
    expect(
      wrapper
        .find('[data-test="incidentLocation"]')
        .first()
        .text()
    ).toEqual("No address specified");
  });

  test("should display a district", () => {
    expect(
      wrapper
        .find('[data-test="incidentDistrict"]')
        .first()
        .text()
    ).toEqual("Second District");
  });

  test("should display intake source", () => {
    expect(
      wrapper
        .find('[data-test="intakeSource"]')
        .first()
        .text()
    ).toEqual("N/A");
  });

  test("should display how did you hear about us source", () => {
    expect(
      wrapper
        .find('[data-test="howDidYouHearAboutUsSource"]')
        .first()
        .text()
    ).toEqual("N/A");
  });

  test("should fetch classifications on mount", () => {
    expect(getClassificationDropdownValues).toHaveBeenCalled();
  });

  test("should fetch intake sources on mount", () => {
    expect(getIntakeSourceDropdownValues).toHaveBeenCalled();
  });

  test("should fetch intake sources on mount", () => {
    expect(getHowDidYouHearAboutUsSourceDropdownValues).toHaveBeenCalled();
  });

  test("should open dialog and prepopulate fields", () => {
    const editButton = wrapper.find(
      'button[data-test="editIncidentDetailsButton"]'
    );
    editButton.simulate("click");

    const editFirstContactDateInput = wrapper.find(
      'input[data-test="editFirstContactDateInput"]'
    );
    const editIncidentDateInput = wrapper.find(
      'input[data-test="editIncidentDateInput"]'
    );
    const editIncidentTimeInput = wrapper.find(
      'input[data-test="editIncidentTimeInput"]'
    );
    const editIncidentClassification = wrapper.find(
      'div[data-test="classificationDropdownInput"]'
    );

    expect(editFirstContactDateInput.prop("value")).toEqual(firstContactDate);
    expect(editIncidentDateInput.prop("value")).toEqual(incidentDate);
    expect(editIncidentTimeInput.prop("value")).toEqual(incidentTime);
    expect(editIncidentClassification.prop("value")).toEqual(12);
  });

  test("should submit form when Save is clicked", () => {
    const editButton = wrapper.find(
      'button[data-test="editIncidentDetailsButton"]'
    );
    editButton.simulate("click");

    changeInput(
      wrapper,
      'input[data-test="editFirstContactDateInput"]',
      "1994-05-03"
    );
    changeInput(
      wrapper,
      'input[data-test="editIncidentDateInput"]',
      "1994-05-02"
    );
    changeInput(wrapper, 'input[data-test="editIncidentTimeInput"]', "13:00");
    selectDropdownOption(
      wrapper,
      '[data-test="districtDropdown"]',
      "1st District"
    );

    const saveButton = wrapper.find(
      'button[data-test="saveIncidentDetailsButton"]'
    );
    saveButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      editIncidentDetails({
        id: currentCase.id,
        firstContactDate: "1994-05-03",
        incidentDate: "1994-05-02",
        incidentTime: "13:00",
        district: "First District",
        classificationId: 12,
        intakeSourceId: 2
      })
    );
  });

  test("should close dialog when cancel is clicked", async () => {
    const editButton = wrapper.find(
      'button[data-test="editIncidentDetailsButton"]'
    );
    editButton.simulate("click");

    const cancelButton = wrapper.find(
      'button[data-test="cancelEditIncidentDetailsButton"]'
    );
    cancelButton.simulate("click");

    await expectEventuallyNotToExist(wrapper, DialogContent);
  });
});
