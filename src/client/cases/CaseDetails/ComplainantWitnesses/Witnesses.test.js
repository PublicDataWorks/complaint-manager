import { containsText } from "../../../testHelpers";
import { mount } from "enzyme/build/index";
import Case from "../../../testUtilities/case";
import Civilian from "../../../testUtilities/civilian";
import createConfiguredStore from "../../../createConfiguredStore";
import {
  CIVILIAN_FORM_NAME,
  WITNESS
} from "../../../../sharedUtilities/constants";
import React from "react";
import Witnesses from "./Witnesses";
import { Provider } from "react-redux";
import _ from "lodash";
import { initialize } from "redux-form";
import editCivilian from "../../thunks/editCivilian";
import { openCivilianDialog } from "../../../actionCreators/casesActionCreators";
import formatAddress from "../../../utilities/formatAddress";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import Officer from "../../../testUtilities/Officer";

jest.mock("redux-form", () => ({
  reducer: { mockReducer: "mockReducerState" },
  initialize: jest.fn(() => ({
    type: "MOCK_INITIALIZE_ACTION"
  }))
}));

describe("Witnesses", () => {
  const menuOpen = true;
  let witnessSection,
    witnesses,
    witnessPanel,
    caseDetail,
    dispatchSpy,
    witness,
    store;
  beforeEach(() => {
    witness = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("")
      .withRaceEthnicity(undefined)
      .withGenderIdentity(undefined)
      .withRoleOnCase(WITNESS)
      .build();

    caseDetail = new Case.Builder()
      .defaultCase()
      .withWitnessCivilians([witness])
      .build();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    witnesses = mount(
      <Provider store={store}>
        <Witnesses
          caseDetail={caseDetail}
          dispatch={dispatchSpy}
          menuOpen={menuOpen}
        />
      </Provider>
    );
    witnessSection = witnesses.find('[data-test="witnessesSection"]').first();
    witnessPanel = witnesses
      .find('[data-test="complainantWitnessesPanel"]')
      .first();
  });

  describe("full name", () => {
    test("should display civilian first and last name", () => {
      const witnessName = witness.fullName;
      containsText(
        witnessSection,
        '[data-test="complainantWitness"]',
        witnessName
      );
    });
  });

  describe("Sort order", () => {
    test("People should be sorted by createdAt ascending", () => {
      const menuOpen = true;
      const civilian1 = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Blake")
        .withLastName("Anderson")
        .withFullName("Blake Anderson")
        .withMiddleInitial("")
        .withSuffix("")
        .withCreatedAt("2018-04-26")
        .withId(1)
        .withRoleOnCase(WITNESS)
        .build();
      const civilian2 = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Amy")
        .withLastName("Smith")
        .withFullName("Amy Smith")
        .withCreatedAt("2018-04-30")
        .withMiddleInitial("")
        .withSuffix("")
        .withId(2)
        .withRoleOnCase(WITNESS)
        .build();
      const civilian3 = new Civilian.Builder()
        .defaultCivilian()
        .withFirstName("Amy")
        .withLastName("Anderson")
        .withFullName("Amy Anderson")
        .withMiddleInitial("")
        .withSuffix("")
        .withCreatedAt("2018-05-01")
        .withId(3)
        .withRoleOnCase(WITNESS)
        .build();

      caseDetail = new Case.Builder()
        .defaultCase()
        .withWitnessCivilians([civilian1, civilian2, civilian3])
        .withComplainantOfficers([])
        .withComplainantCivilians([])
        .withWitnessOfficers([])
        .build();

      witnesses = mount(
        <Provider store={store}>
          <Witnesses caseDetail={caseDetail} menuOpen={menuOpen} />
        </Provider>
      );

      const witnessNames = witnesses.find('[data-test="complainantWitness"]');
      const uniqueWitnessNamesRendered = _.uniq(
        witnessNames.map(witness => witness.text())
      );
      expect(uniqueWitnessNamesRendered).toEqual([
        "Blake Anderson",
        "Amy Smith",
        "Amy Anderson"
      ]);
    });
  });

  describe("Edit", () => {
    test("should open and initialize edit complainant dialog when edit is clicked", () => {
      const editLink = witnesses
        .find('[data-test="editComplainantLink"]')
        .first();
      editLink.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCivilianDialog("Edit Civilian", "Save", editCivilian)
      );
      expect(initialize).toHaveBeenCalledWith(CIVILIAN_FORM_NAME, witness);
    });
  });

  describe("phone number", () => {
    test("should display phone number expanded", () => {
      const expectedPhoneNumber = "(123) 456-7890";
      containsText(
        witnessPanel,
        '[data-test="complainantPhoneNumber"]',
        expectedPhoneNumber
      );
    });
  });

  describe("email", () => {
    test("should display email when expanded", () => {
      const complainantPanel = witnessSection
        .find('[data-test="complainantWitnessesPanel"]')
        .first();
      containsText(
        complainantPanel,
        '[data-test="complainantEmail"]',
        witness.email
      );
    });
  });

  describe("address", () => {
    test("should display N/A when no address", () => {
      const menuOpen = true;
      const civilianWithNoAddress = new Civilian.Builder()
        .defaultCivilian()
        .withClearedOutAddress()
        .withRoleOnCase(WITNESS)
        .build();

      const caseWithNoAddress = new Case.Builder()
        .defaultCase()
        .withWitnessCivilians([civilianWithNoAddress])
        .build();

      witnesses = mount(
        <Provider store={store}>
          <Witnesses caseDetail={caseWithNoAddress} menuOpen={menuOpen} />
        </Provider>
      );

      witnessPanel = witnesses
        .find('[data-test="complainantWitnessesPanel"]')
        .first();
      containsText(
        witnessPanel,
        '[data-test="civilianAddress"]',
        "No address specified"
      );
    });

    test("should display address when present", () => {
      const expectedAddress = formatAddress(
        caseDetail.witnessCivilians[0].address
      );

      containsText(
        witnessPanel,
        '[data-test="civilianAddress"]',
        expectedAddress
      );
    });
  });

  describe("additional address info", () => {
    test("should be empty when no address", () => {
      const menuOpen = true;
      const civilianWithNoAddress = new Civilian.Builder()
        .defaultCivilian()
        .withClearedOutAddress()
        .withRoleOnCase(WITNESS)
        .build();

      const caseWithNoAddress = new Case.Builder()
        .defaultCase()
        .withWitnessCivilians([civilianWithNoAddress])
        .build();

      witnesses = mount(
        <Provider store={store}>
          <Witnesses caseDetail={caseWithNoAddress} menuOpen={menuOpen} />
        </Provider>
      );

      witnessPanel = witnesses
        .find('[data-test="complainantWitnessesPanel"]')
        .first();
      containsText(
        witnessPanel,
        '[data-test="civilianAddressAdditionalInfo"]',
        ""
      );
    });
    test("should display additional address info when present", () => {
      containsText(
        witnessPanel,
        '[data-test="civilianAddressAdditionalInfo"]',
        caseDetail.witnessCivilians[0].address.streetAddress2
      );
    });
  });

  describe("additional info", () => {
    test("should display additional info when present", () => {
      containsText(
        witnessPanel,
        '[data-test="complainantAdditionalInfo"]',
        witness.additionalInfo
      );
    });
  });

  test("should display officer and civilian witnesses", () => {
    const menuOpen = true;
    const civilianWitness = new Civilian.Builder()
      .defaultCivilian()
      .withFullName("First Alpha")
      .withRoleOnCase(WITNESS)
      .build();

    const officerWitness = new Officer.Builder()
      .defaultOfficer()
      .withLastName("Miller")
      .build();

    const caseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerWitness)
      .withRoleOnCase(WITNESS)
      .build();

    const caseWithMixedComplainants = new Case.Builder()
      .defaultCase()
      .withWitnessCivilians([civilianWitness])
      .withWitnessOfficers([caseOfficer])
      .build();

    const wrapper = mount(
      <Provider store={store}>
        <Witnesses caseDetail={caseWithMixedComplainants} menuOpen={menuOpen} />
      </Provider>
    );

    const complainantPanel = wrapper
      .find('[data-test="complainantWitnessesPanel"]')
      .first();

    expect(complainantPanel.text()).toContain("Alpha");
  });
});
