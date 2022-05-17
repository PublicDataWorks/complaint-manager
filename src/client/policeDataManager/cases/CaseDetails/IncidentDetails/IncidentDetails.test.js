import React from "react";
import IncidentDetails from "./IncidentDetails";
import { mount } from "enzyme";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import Case from "../../../../../sharedTestHelpers/case";
import formatDate from "../../../../../sharedUtilities/formatDate";
import editIncidentDetails from "../../thunks/editIncidentDetails";
import {
  changeInput,
  expectEventuallyNotToExist,
  selectDropdownOption
} from "../../../../testHelpers";
import { DialogContent } from "@material-ui/core";
import getIntakeSourceDropdownValues from "../../../intakeSources/thunks/getIntakeSourceDropdownValues";
import getHowDidYouHearAboutUsSourceDropdownValues from "../../../howDidYouHearAboutUsSources/thunks/getHowDidYouHearAboutUsSourceDropdownValues";
import { getDistrictsSuccess } from "../../../actionCreators/districtsActionCreators";
import getDistrictDropdownValues from "../../../districts/thunks/getDistrictDropdownValues";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

jest.mock("../../thunks/editIncidentDetails", () =>
  jest.fn(values => ({
    type: "EDIT_INCIDENT_DETAILS_MOCK_THUNK",
    values
  }))
);

jest.mock("../../../districts/thunks/getDistrictDropdownValues", () =>
  jest.fn(values => ({
    type: "GET_DISTRICT_MOCK",
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

jest.mock("../CivilianDialog/MapServices/MapService");

describe("incident details", () => {
  let incidentDetails,
    currentCase,
    firstContactDate,
    incidentDate,
    incidentTime,
    incidentTimezone,
    wrapper,
    dispatchSpy,
    formattedIncidentTime;

  describe("without permissions", () => {
    beforeEach(() => {
      const store = createConfiguredStore();

      firstContactDate = "1994-05-01";
      incidentDate = "1994-04-24";
      incidentTime = "14:00:00";
      incidentTimezone = "CDT";
      formattedIncidentTime = "02:00 PM CDT";

      currentCase = new Case.Builder()
        .defaultCase()
        .withFirstContactDate(firstContactDate)
        .withIncidentDate(incidentDate)
        .withIncidentTime(incidentTime)
        .withIncidentTimezone(incidentTimezone)
        .withIncidentLocation(undefined)
        .withDistrictId(2)
        .withIntakeSourceId(2)
        .build();

      dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch(getCaseDetailsSuccess(currentCase));
      store.dispatch(
        getDistrictsSuccess([
          ["1st District", 1],
          ["2nd District", 2]
        ])
      );
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.ADD_TAG_TO_CASE] }
      });
      wrapper = mount(
        <Provider store={store}>
          <IncidentDetails classes={{}} />
        </Provider>
      );
      incidentDetails = wrapper.find(IncidentDetails);
    });

    test("should not display edit button", () => {
      expect(wrapper.text().includes("Edit")).toBeFalse();
    });
  });

  describe("with permissions", () => {
    beforeEach(() => {
      const store = createConfiguredStore();

      firstContactDate = "1994-05-01";
      incidentDate = "1994-04-24";
      incidentTime = "14:00:00";
      incidentTimezone = "CDT";
      formattedIncidentTime = "02:00 PM CDT";

      currentCase = new Case.Builder()
        .defaultCase()
        .withFirstContactDate(firstContactDate)
        .withIncidentDate(incidentDate)
        .withIncidentTime(incidentTime)
        .withIncidentTimezone(incidentTimezone)
        .withIncidentLocation(undefined)
        .withDistrictId(2)
        .withIntakeSourceId(2)
        .build();

      dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch(getCaseDetailsSuccess(currentCase));
      store.dispatch(
        getDistrictsSuccess([
          ["1st District", 1],
          ["2nd District", 2]
        ])
      );
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
      });
      wrapper = mount(
        <Provider store={store}>
          <IncidentDetails classes={{}} />
        </Provider>
      );
      incidentDetails = wrapper.find(IncidentDetails);
    });

    test("should display first contact date", () => {
      expect(
        wrapper.find('[data-testid="firstContactDate"]').first().text()
      ).toEqual(formatDate(firstContactDate));
    });

    test("should display incident Date", () => {
      expect(
        wrapper.find('[data-testid="incidentDate"]').first().text()
      ).toEqual(formatDate(incidentDate));
    });

    test("should display incident time", () => {
      expect(
        wrapper.find('[data-testid="incidentTime"]').first().text()
      ).toEqual(formattedIncidentTime);
    });

    test("should display incident location", () => {
      expect(
        wrapper.find('[data-testid="incidentLocation"]').first().text()
      ).toEqual("No address specified");
    });

    test("should display a district", () => {
      expect(
        wrapper.find('[data-testid="incidentDistrict"]').first().text()
      ).toEqual("N/A");
    });

    test("should display intake source", () => {
      expect(
        wrapper.find('[data-testid="intakeSource"]').first().text()
      ).toEqual("N/A");
    });

    test("should display how did you hear about us source", () => {
      expect(
        wrapper
          .find('[data-testid="howDidYouHearAboutUsSource"]')
          .first()
          .text()
      ).toEqual("N/A");
    });

    test("should fetch intake sources on mount", () => {
      expect(getIntakeSourceDropdownValues).toHaveBeenCalled();
    });

    test("should fetch intake sources on mount", () => {
      expect(getHowDidYouHearAboutUsSourceDropdownValues).toHaveBeenCalled();
    });

    test("should fetch districts on mount", () => {
      expect(getDistrictDropdownValues).toHaveBeenCalled();
    });

    test("should open dialog and prepopulate fields", () => {
      const editButton = wrapper.find(
        'button[data-testid="editIncidentDetailsButton"]'
      );
      editButton.simulate("click");

      const editFirstContactDateInput = wrapper.find(
        'input[data-testid="editFirstContactDateInput"]'
      );
      const editIncidentDateInput = wrapper.find(
        'input[data-testid="editIncidentDateInput"]'
      );
      const editIncidentTimeInput = wrapper.find(
        'input[data-testid="editIncidentTimeInput"]'
      );

      const editDistrict = wrapper
        .find("[data-testid='districtDropdown']")
        .find("ForwardRef(Autocomplete)");

      expect(editFirstContactDateInput.prop("value")).toEqual(firstContactDate);
      expect(editIncidentDateInput.prop("value")).toEqual(incidentDate);
      expect(editIncidentTimeInput.prop("value")).toEqual(incidentTime);
      expect(editDistrict.prop("value").value).toEqual(2);
    });

    test("should submit form when Save is clicked", () => {
      const editButton = wrapper.find(
        'button[data-testid="editIncidentDetailsButton"]'
      );
      editButton.simulate("click");

      changeInput(
        wrapper,
        'input[data-testid="editFirstContactDateInput"]',
        "1994-05-03"
      );
      changeInput(
        wrapper,
        'input[data-testid="editIncidentDateInput"]',
        "1994-05-02"
      );
      changeInput(
        wrapper,
        'input[data-testid="editIncidentTimeInput"]',
        "13:00"
      );
      selectDropdownOption(
        wrapper,
        '[data-testid="districtDropdown"]',
        "1st District"
      );
      selectDropdownOption(
        wrapper,
        '[data-testid="editIncidentTimezoneDropdown"]',
        "CDT"
      );

      const saveButton = wrapper.find(
        'button[data-testid="saveIncidentDetailsButton"]'
      );
      saveButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        editIncidentDetails({
          id: currentCase.id,
          firstContactDate: "1994-05-03",
          incidentDate: "1994-05-02",
          incidentTime: "13:00",
          incidentTimezone: "CDT",
          districtId: 1,
          intakeSourceId: 2
        })
      );
    });

    test("should close dialog when cancel is clicked", async () => {
      const editButton = wrapper.find(
        'button[data-testid="editIncidentDetailsButton"]'
      );
      editButton.simulate("click");

      const cancelButton = wrapper.find(
        'button[data-testid="cancelEditIncidentDetailsButton"]'
      );
      cancelButton.simulate("click");

      await expectEventuallyNotToExist(wrapper, DialogContent);
    });
  });
});
