import React from "react";
import { containsText } from "../../../../testHelpers";
import ComplainantWitnesses from "./ComplainantWitnesses";
import { mount } from "enzyme";
import { openCivilianDialog } from "../../../actionCreators/casesActionCreators";
import createConfiguredStore from "../../../createConfiguredStore";
import { initialize } from "redux-form";
import formatAddress from "../../../utilities/formatAddress";
import Civilian from "../../../testUtilities/civilian";
import Case from "../../../testUtilities/case";
import formatCivilianName from "../../../utilities/formatCivilianName";
import editCivilian from "../../thunks/editCivilian";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";
import _ from "lodash";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import Officer from "../../../testUtilities/Officer";
import { Provider } from "react-redux";

jest.mock("redux-form", () => ({
  reducer: { mockReducer: "mockReducerState" },
  initialize: jest.fn(() => ({
    type: "MOCK_INITIALIZE_ACTION"
  }))
}));

describe("Complainant and Witnesses", () => {
  let complainantWitnessesSection,
    complainantWitnesses,
    complainantPanel,
    caseDetail,
    dispatchSpy,
    complainant,
    store;
  beforeEach(() => {
    complainant = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("")
      .withRaceEthnicity(undefined)
      .withGenderIdentity(undefined)
      .build();

    caseDetail = new Case.Builder()
      .defaultCase()
      .withComplainantCivilians([complainant])
      .build();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    complainantWitnesses = mount(
      <Provider store={store}>
        <ComplainantWitnesses caseDetail={caseDetail} dispatch={dispatchSpy} />
      </Provider>
    );
    complainantWitnessesSection = complainantWitnesses
      .find('[data-test="complainantWitnessesSection"]')
      .first();
    complainantPanel = complainantWitnesses
      .find('[data-test="complainantWitnessesPanel"]')
      .first();
  });

  describe("full name", () => {
    test("should display civilian first and last name", () => {
      const complainantName = formatCivilianName(complainant);
      containsText(
        complainantWitnessesSection,
        '[data-test="complainant"]',
        complainantName
      );
    });
  });

  describe("Sort order", () => {
    test("People should be sorted by createdAt descending", () => {
      const civilian1 = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Blake")
        .withLastName("Anderson")
        .withMiddleInitial("")
        .withSuffix("")
        .withCreatedAt("2018-04-26")
        .withId(1)
        .build();
      const civilian2 = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Amy")
        .withLastName("Smith")
        .withCreatedAt("2018-04-30")
        .withMiddleInitial("")
        .withSuffix("")
        .withId(2)
        .build();
      const civilian3 = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Amy")
        .withLastName("Anderson")
        .withMiddleInitial("")
        .withSuffix("")
        .withCreatedAt("2018-05-01")
        .withId(3)
        .build();

      caseDetail = new Case.Builder()
        .defaultCase()
        .withComplainantCivilians([civilian1, civilian2, civilian3])
        .withComplainantOfficers([])
        .withWitnessCivilians([])
        .withWitnessOfficers([])
        .build();

      complainantWitnesses = mount(
        <Provider store={store}>
          <ComplainantWitnesses caseDetail={caseDetail} />
        </Provider>
      );

      const complainantNames = complainantWitnesses.find(
        '[data-test="complainant"]'
      );
      const uniqueComplainantNamesRendered = _.uniq(
        complainantNames.map(complainant => complainant.text())
      );
      expect(uniqueComplainantNamesRendered).toEqual([
        "Amy Anderson",
        "Amy Smith",
        "Blake Anderson"
      ]);
    });
  });

  describe("Edit", () => {
    test("should open and initialize edit complainant dialog when edit is clicked", () => {
      const editLink = complainantWitnesses
        .find('[data-test="editComplainantLink"]')
        .first();
      editLink.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Edit Civilian", "Save", editCivilian)
      );
      expect(initialize).toHaveBeenCalledWith(CIVILIAN_FORM_NAME, complainant);
    });
  });

  describe("phone number", () => {
    test("should display phone number expanded", () => {
      const expectedPhoneNumber = "(123) 456-7890";
      containsText(
        complainantPanel,
        '[data-test="complainantPhoneNumber"]',
        expectedPhoneNumber
      );
    });
  });

  describe("email", () => {
    test("should display email when expanded", () => {
      const complainantPanel = complainantWitnessesSection
        .find('[data-test="complainantWitnessesPanel"]')
        .first();
      containsText(
        complainantPanel,
        '[data-test="complainantEmail"]',
        complainant.email
      );
    });
  });

  describe("address", () => {
    test("should display N/A when no address", () => {
      const civilianWithNoAddress = new Civilian.Builder()
        .defaultCivilian()
        .withClearedOutAddress()
        .build();

      const caseWithNoAddress = new Case.Builder()
        .defaultCase()
        .withComplainantCivilians([civilianWithNoAddress])
        .build();

      complainantWitnesses = mount(
        <Provider store={store}>
          <ComplainantWitnesses caseDetail={caseWithNoAddress} />
        </Provider>
      );

      complainantPanel = complainantWitnesses
        .find('[data-test="complainantWitnessesPanel"]')
        .first();
      containsText(
        complainantPanel,
        '[data-test="civilianAddress"]',
        "No address specified"
      );
    });

    test("should display address when present", () => {
      const expectedAddress = formatAddress(
        caseDetail.complainantCivilians[0].address
      );

      containsText(
        complainantPanel,
        '[data-test="civilianAddress"]',
        expectedAddress
      );
    });
  });

  describe("additional address info", () => {
    test("should be empty when no address", () => {
      const civilianWithNoAddress = new Civilian.Builder()
        .defaultCivilian()
        .withClearedOutAddress()
        .build();

      const caseWithNoAddress = new Case.Builder()
        .defaultCase()
        .withComplainantCivilians([civilianWithNoAddress])
        .build();

      complainantWitnesses = mount(
        <Provider store={store}>
          <ComplainantWitnesses caseDetail={caseWithNoAddress} />
        </Provider>
      );

      complainantPanel = complainantWitnesses
        .find('[data-test="complainantWitnessesPanel"]')
        .first();
      containsText(
        complainantPanel,
        '[data-test="civilianAddressAdditionalInfo"]',
        ""
      );
    });
    test("should display additional address info when present", () => {
      containsText(
        complainantPanel,
        '[data-test="civilianAddressAdditionalInfo"]',
        caseDetail.complainantCivilians[0].address.streetAddress2
      );
    });
  });

  describe("additional info", () => {
    test("should display additional info when present", () => {
      containsText(
        complainantPanel,
        '[data-test="complainantAdditionalInfo"]',
        complainant.additionalInfo
      );
    });
  });

  test("warning message shows when no complainants", () => {
    const witness = new Civilian.Builder()
      .defaultCivilian()
      .withRoleOnCase("Witness")
      .build();

    const caseWithoutComplainant = new Case.Builder()
      .defaultCase()
      .withWitnessCivilians([witness])
      .withComplainantCivilians([])
      .withComplainantOfficers([])
      .build();

    const wrapper = mount(
      <Provider store={store}>
        <ComplainantWitnesses caseDetail={caseWithoutComplainant} />
      </Provider>
    );
    const warn = wrapper.find("[data-test='warnIcon']");

    expect(warn.exists()).toBeTruthy();
    containsText(
      wrapper,
      "[data-test='complainantWitnessesSection']",
      "Please add at least one complainant to this case"
    );
  });

  test("warning message does not when no complainants", () => {
    const title = complainantWitnesses.find("[data-test='warnIcon']");

    expect(title.exists()).toBeFalsy();
  });

  test("should display another warning message when no complainants or witnesses on a case", () => {
    const caseWithoutComplainant = new Case.Builder()
      .defaultCase()
      .withComplainantCivilians([])
      .withComplainantOfficers([])
      .withWitnessCivilians([])
      .withWitnessOfficers([])
      .build();

    const wrapper = mount(
      <Provider store={store}>
        <ComplainantWitnesses caseDetail={caseWithoutComplainant} />
      </Provider>
    );
    const noCivilianMessage = wrapper.find("[data-test='noCivilianMessage']");

    expect(noCivilianMessage.exists()).toBeTruthy();
  });

  test("should display officer and civilian complainants", () => {
    const civilianComplainant = new Civilian.Builder()
      .defaultCivilian()
      .withLastName("Alpha")
      .build();

    const officerComplainant = new Officer.Builder()
      .defaultOfficer()
      .withLastName("Miller")
      .build();

    const caseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficer(officerComplainant)
      .build();

    const caseWithMixedComplainants = new Case.Builder()
      .defaultCase()
      .withComplainantCivilians([civilianComplainant])
      .withComplainantOfficers([caseOfficer])
      .build();

    const wrapper = mount(
      <Provider store={store}>
        <ComplainantWitnesses caseDetail={caseWithMixedComplainants} />
      </Provider>
    );

    const complainantPanel = wrapper
      .find('[data-test="complainantWitnessesPanel"]')
      .first();

    expect(complainantPanel.text()).toContain("Alpha");
  });
});
