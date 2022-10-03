import React from "react";
import { containsText } from "../../../../testHelpers";
import Complainants from "./Complainants";
import { mount } from "enzyme";
import {
  getCaseDetailsSuccess,
  openCivilianDialog
} from "../../../actionCreators/casesActionCreators";
import createConfiguredStore from "../../../../createConfiguredStore";
import { initialize } from "redux-form";
import { formatAddressAsString } from "../../../utilities/formatAddress";
import Civilian from "../../../../../sharedTestHelpers/civilian";
import Case from "../../../../../sharedTestHelpers/case";
import editCivilian from "../../thunks/editCivilian";
import {
  CIVILIAN_FORM_NAME,
  USER_PERMISSIONS,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import _ from "lodash";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import { Provider } from "react-redux";
import RaceEthnicity from "../../../../../sharedTestHelpers/raceEthnicity";

jest.mock("redux-form", () => ({
  reducer: { mockReducer: "mockReducerState" },
  initialize: jest.fn(() => ({
    type: "MOCK_INITIALIZE_ACTION"
  }))
}));

describe("Complainants", () => {
  const menuOpen = true;
  const raceEthnicity = new RaceEthnicity.Builder()
    .defaultRaceEthnicity()
    .build();
  let complainantWitnessesSection,
    complainantWitnesses,
    complainantPanel,
    caseDetails,
    dispatchSpy,
    complainant,
    store;
  beforeEach(() => {
    complainant = {
      ...new Civilian.Builder()
        .defaultCivilian()
        .withBirthDate("")
        .withRaceEthnicityId(undefined)
        .build(),
      raceEthnicity: raceEthnicity
    };

    caseDetails = new Case.Builder()
      .defaultCase()
      .withComplainantCivilians([complainant])
      .build();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(getCaseDetailsSuccess(caseDetails));
  });

  describe("without permissions", () => {
    beforeEach(() => {
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.ADD_TAG_TO_CASE] }
      });
      complainantWitnesses = mount(
        <Provider store={store}>
          <Complainants
            caseDetails={caseDetails}
            dispatch={dispatchSpy}
            menuOpen={menuOpen}
            classes={{}}
          />
        </Provider>
      );
    });

    test("should not be able to add", () => {
      expect(complainantWitnesses.text().includes("+ Add")).toBeFalse();
    });

    test("should not be able to edit", () => {
      expect(
        complainantWitnesses.find('[data-testid="editComplainantLink"]')
      ).toHaveLength(0);
    });

    test("should not be able to remove", () => {
      expect(
        complainantWitnesses.find('[data-testid="removeCivilianLink"]')
      ).toHaveLength(0);
    });
  });

  describe("with permissions", () => {
    beforeEach(() => {
      store.dispatch({
        type: "AUTH_SUCCESS",
        userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
      });

      complainantWitnesses = mount(
        <Provider store={store}>
          <Complainants
            caseDetails={caseDetails}
            dispatch={dispatchSpy}
            menuOpen={menuOpen}
            classes={{}}
          />
        </Provider>
      );
      complainantWitnessesSection = complainantWitnesses
        .find('[data-testid="complainantWitnessesSection"]')
        .first();
      complainantPanel = complainantWitnesses
        .find('[data-testid="complainantWitnessesPanel"]')
        .first();
    });

    describe("full name", () => {
      test("should display civilian first and last name", () => {
        const complainantName = complainant.fullName;
        containsText(
          complainantWitnessesSection,
          '[data-testid="complainantWitness"]',
          complainantName
        );
      });
    });

    describe("Sort order", () => {
      test("People should be sorted by createdAt ascending", () => {
        const menuOpen = true;
        const civilian1 = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withFirstName("Blake")
            .withLastName("Anderson")
            .withFullName("Blake Anderson")
            .withMiddleInitial("")
            .withSuffix("")
            .withCreatedAt("2018-04-26")
            .withId(1)
            .build(),
          raceEthnicity
        };
        const civilian2 = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withFirstName("Amy")
            .withLastName("Smith")
            .withFullName("Amy Smith")
            .withCreatedAt("2018-04-30")
            .withMiddleInitial("")
            .withSuffix("")
            .withId(2)
            .build(),
          raceEthnicity
        };
        const civilian3 = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withFirstName("Amy")
            .withLastName("Anderson")
            .withFullName("Amy Anderson")
            .withMiddleInitial("")
            .withSuffix("")
            .withCreatedAt("2018-05-01")
            .withId(3)
            .build(),
          raceEthnicity
        };

        caseDetails = new Case.Builder()
          .defaultCase()
          .withComplainantCivilians([civilian1, civilian2, civilian3])
          .withComplainantOfficers([])
          .withWitnessCivilians([])
          .withWitnessOfficers([])
          .build();

        complainantWitnesses = mount(
          <Provider store={store}>
            <Complainants
              caseDetails={caseDetails}
              menuOpen={menuOpen}
              classes={{}}
            />
          </Provider>
        );

        const complainantNames = complainantWitnesses.find(
          '[data-testid="complainantWitness"]'
        );
        const uniqueComplainantNamesRendered = _.uniq(
          complainantNames.map(complainant => complainant.text())
        );
        expect(uniqueComplainantNamesRendered).toEqual([
          "Blake Anderson",
          "Amy Smith",
          "Amy Anderson"
        ]);
      });
    });

    describe("Edit", () => {
      test("should open and initialize edit complainant dialog when edit is clicked", () => {
        const editLink = complainantWitnesses
          .find('[data-testid="editComplainantLink"]')
          .first();
        editLink.simulate("click");

        expect(dispatchSpy).toHaveBeenCalledWith(
          openCivilianDialog("Edit Civilian", "Save", editCivilian)
        );
        expect(initialize).toHaveBeenCalledWith(CIVILIAN_FORM_NAME, {
          ...complainant,
          isUnknown: false,
          raceEthnicity: undefined,
          genderIdentity: undefined,
          fullName: undefined
        });
      });
    });

    describe("phone number", () => {
      test("should display phone number expanded", () => {
        const expectedPhoneNumber = "(123) 456-7890";
        containsText(
          complainantPanel,
          '[data-testid="complainantPhoneNumber"]',
          expectedPhoneNumber
        );
      });
    });

    describe("email", () => {
      test("should display email when expanded", () => {
        const complainantPanel = complainantWitnessesSection
          .find('[data-testid="complainantWitnessesPanel"]')
          .first();
        containsText(
          complainantPanel,
          '[data-testid="complainantEmail"]',
          complainant.email
        );
      });
    });

    describe("address", () => {
      test("should display N/A when no address", () => {
        const menuOpen = true;
        const civilianWithNoAddress = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withClearedOutAddress()
            .build(),
          raceEthnicity
        };

        const caseWithNoAddress = new Case.Builder()
          .defaultCase()
          .withComplainantCivilians([civilianWithNoAddress])
          .build();

        complainantWitnesses = mount(
          <Provider store={store}>
            <Complainants
              caseDetails={caseWithNoAddress}
              menuOpen={menuOpen}
              classes={{}}
            />
          </Provider>
        );

        complainantPanel = complainantWitnesses
          .find('[data-testid="complainantWitnessesPanel"]')
          .first();
        containsText(
          complainantPanel,
          '[data-testid="civilianAddress"]',
          "No address specified"
        );
      });

      test("should display address when present", () => {
        const expectedAddress = formatAddressAsString(
          caseDetails.complainantCivilians[0].address
        );

        containsText(
          complainantPanel,
          '[data-testid="civilianAddress"]',
          expectedAddress
        );
      });
    });

    describe("additional address info", () => {
      test("should be empty when no address", () => {
        const menuOpen = true;
        const civilianWithNoAddress = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withClearedOutAddress()
            .build(),
          raceEthnicity
        };

        const caseWithNoAddress = new Case.Builder()
          .defaultCase()
          .withComplainantCivilians([civilianWithNoAddress])
          .build();

        complainantWitnesses = mount(
          <Provider store={store}>
            <Complainants
              caseDetails={caseWithNoAddress}
              menuOpen={menuOpen}
              classes={{}}
            />
          </Provider>
        );

        complainantPanel = complainantWitnesses
          .find('[data-testid="complainantWitnessesPanel"]')
          .first();
        containsText(complainantPanel, '[data-testid="civilianAddress"]', "");
      });
      test("should display additional address info when present", () => {
        containsText(
          complainantPanel,
          '[data-testid="civilianAddress"]',
          caseDetails.complainantCivilians[0].address.streetAddress2
        );
      });
    });

    describe("additional info", () => {
      test("should display additional info when present", () => {
        containsText(
          complainantPanel,
          '[data-testid="complainantAdditionalInfo"]',
          complainant.additionalInfo
        );
      });
    });

    test("warning message shows when no complainants", () => {
      const menuOpen = true;
      const witness = new Civilian.Builder()
        .defaultCivilian()
        .withRoleOnCase(WITNESS)
        .build();

      const caseWithoutComplainant = new Case.Builder()
        .defaultCase()
        .withWitnessCivilians([witness])
        .withComplainantCivilians([])
        .withComplainantOfficers([])
        .build();

      const wrapper = mount(
        <Provider store={store}>
          <Complainants
            caseDetails={caseWithoutComplainant}
            menuOpen={menuOpen}
            classes={{}}
          />
        </Provider>
      );
      const warn = wrapper.find("[data-testid='warnIcon']");

      expect(warn.exists()).toBeTruthy();
      containsText(
        wrapper,
        "[data-testid='complainantWitnessesSection']",
        "Please add at least one complainant to this case"
      );
    });

    test("warning message does not when no complainants", () => {
      const title = complainantWitnesses.find("[data-testid='warnIcon']");

      expect(title.exists()).toBeFalsy();
    });

    test("should display another warning message when no complainants or witnesses on a case", () => {
      const menuOpen = true;
      const caseWithoutComplainant = new Case.Builder()
        .defaultCase()
        .withComplainantCivilians([])
        .withComplainantOfficers([])
        .withWitnessCivilians([])
        .withWitnessOfficers([])
        .build();

      const wrapper = mount(
        <Provider store={store}>
          <Complainants
            caseDetails={caseWithoutComplainant}
            menuOpen={menuOpen}
            classes={{}}
          />
        </Provider>
      );
      const noCivilianMessage = wrapper.find(
        "[data-testid='noCivilianMessage']"
      );

      expect(noCivilianMessage.exists()).toBeTruthy();
    });

    test("should display officer and civilian complainants", () => {
      const menuOpen = true;
      const civilianComplainant = {
        ...new Civilian.Builder()
          .defaultCivilian()
          .withFullName("First Alpha")
          .build(),
        raceEthnicity
      };

      const officerComplainant = new Officer.Builder()
        .defaultOfficer()
        .withLastName("Miller")
        .build();

      const caseOfficer = new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(officerComplainant)
        .build();

      const caseWithMixedComplainants = new Case.Builder()
        .defaultCase()
        .withComplainantCivilians([civilianComplainant])
        .withComplainantOfficers([caseOfficer])
        .build();

      const wrapper = mount(
        <Provider store={store}>
          <Complainants
            caseDetails={caseWithMixedComplainants}
            menuOpen={menuOpen}
            classes={{}}
          />
        </Provider>
      );

      const complainantPanel = wrapper
        .find('[data-testid="complainantWitnessesPanel"]')
        .first();

      expect(complainantPanel.text()).toContain("Alpha");
    });
  });
});
