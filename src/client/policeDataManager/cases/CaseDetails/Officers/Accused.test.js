import React from "react";
import { containsText } from "../../../../testHelpers";
import Accused from "./Accused";
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
import Inmate from "../../../../../sharedTestHelpers/Inmate";
import CaseInmate from "../../../../../sharedTestHelpers/CaseInmate";
import editCivilian from "../../thunks/editCivilian";
import {
  CIVILIAN_FORM_NAME,
  SHOW_FORM,
  USER_PERMISSIONS,
  WITNESS,
  GET_PERSON_TYPES
} from "../../../../../sharedUtilities/constants";
import _ from "lodash";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import { Provider } from "react-redux";
import RaceEthnicity from "../../../../../sharedTestHelpers/raceEthnicity";

const payload = [
  {
    key: "OFFICER",
    description: "Officer",
    employeeDescription: "Officer",
    isEmployee: true,
    abbreviation: "O",
    legend: "Officer (O)",
    dialogAction: "/redirect",
    isDefault: false
  },
  {
    key: "OTHER",
    description: "not an officer",
    abbreviation: "OTH",
    legend: "not an officer (OTH)",
    dialogAction: SHOW_FORM,
    isDefault: true,
    subTypes: ["Other1", "Other2", "Other3"]
  }
];

jest.mock("redux-form", () => ({
  reducer: { mockReducer: "mockReducerState" },
  initialize: jest.fn(() => ({
    type: "MOCK_INITIALIZE_ACTION"
  }))
}));

describe("Accused", () => {
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
    const inmate = new Inmate.Builder()
      .defaultInmate()
      .withFirstName("Billy")
      .build();
    const caseInmate = new CaseInmate.Builder()
      .defaultCaseInmate()
      .withInmate(inmate)
      .build();

    caseDetails = new Case.Builder()
      .defaultCase()
      .withAccusedCivilians([complainant])
      .withAccusedInmates([
        {
          ...caseInmate,
          inmate: { ...caseInmate.inmate, fullName: "Billy Bob" }
        }
      ])
      .build();

    store = createConfiguredStore();
    store.dispatch({
      type: GET_PERSON_TYPES,
      payload: payload
    });
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
          <Accused
            caseDetails={caseDetails}
            dispatch={dispatchSpy}
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

    test("should not be able to remove", () => {
      expect(
        complainantWitnesses.find('[data-testid="removePersonInCustodyLink"]')
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
          <Accused
            caseDetails={caseDetails}
            dispatch={dispatchSpy}
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
          .withAccusedCivilians([civilian1, civilian2, civilian3])
          .withAccusedOfficers([])
          .withWitnessCivilians([])
          .withWitnessOfficers([])
          .build();

        complainantWitnesses = mount(
          <Provider store={store}>
            <Accused caseDetails={caseDetails} classes={{}} />
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
        const civilianWithNoAddress = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withClearedOutAddress()
            .build(),
          raceEthnicity
        };

        const caseWithNoAddress = new Case.Builder()
          .defaultCase()
          .withAccusedCivilians([civilianWithNoAddress])
          .build();

        complainantWitnesses = mount(
          <Provider store={store}>
            <Accused caseDetails={caseWithNoAddress} classes={{}} />
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
        const civilianWithNoAddress = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withClearedOutAddress()
            .build(),
          raceEthnicity
        };

        const caseWithNoAddress = new Case.Builder()
          .defaultCase()
          .withAccusedCivilians([civilianWithNoAddress])
          .build();

        complainantWitnesses = mount(
          <Provider store={store}>
            <Accused caseDetails={caseWithNoAddress} classes={{}} />
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

    test("should display another warning message when no Accused or witnesses on a case", () => {
      const caseWithoutAccused = new Case.Builder()
        .defaultCase()
        .withAccusedCivilians([])
        .withAccusedOfficers([])
        .withAccusedInmates([])
        .withWitnessCivilians([])
        .withWitnessOfficers([])
        .build();

      const wrapper = mount(
        <Provider store={store}>
          <Accused caseDetails={caseWithoutAccused} classes={{}} />
        </Provider>
      );
      const noCivilianMessage = wrapper.find(
        "[data-testid='noAccusedOfficersMessage']"
      );

      expect(noCivilianMessage.exists()).toBeTruthy();
    });

    test("should display officer, civilian, and inmate Accused", () => {
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

      const inmate = new Inmate.Builder()
        .defaultInmate()
        .withFirstName("Billy")
        .build();
      const caseInmate = new CaseInmate.Builder()
        .defaultCaseInmate()
        .withInmateId(inmate.inmateId)
        .withInmate(inmate)
        .build();

      const caseWithMixedAccused = new Case.Builder()
        .defaultCase()
        .withAccusedCivilians([civilianComplainant])
        .withAccusedOfficers([caseOfficer])
        .withAccusedInmates([
          {
            ...caseInmate,
            inmate: { ...caseInmate.inmate, fullName: "Billy Bob" }
          }
        ])
        .build();

      const wrapper = mount(
        <Provider store={store}>
          <Accused caseDetails={caseWithMixedAccused} classes={{}} />
        </Provider>
      );

      const complainantPanel = wrapper
        .find('[data-testid="complainantWitnessesPanel"]')
        .first();

      const officerPanel = wrapper
        .find('[data-testid="knownOfficerPanel"]')
        .first();
      const inmatePanel = wrapper.find('[data-testid="inmate-panel"]').first();

      expect(complainantPanel.text()).toContain("Alpha");
      expect(complainantPanel.text()).toContain("Civilian");
      expect(inmatePanel.text()).toContain("Billy");
    });

    test("should display the person type of a complainant civilian if there is one", () => {
      let type = "OTHER";
      const civilianComplainant = {
        ...new Civilian.Builder()
          .defaultCivilian()
          .withFullName("First Alpha")
          .withPersonType(type)
          .build(),
        raceEthnicity
      };

      const caseWithCivilianComplainant = new Case.Builder()
        .defaultCase()
        .withAccusedCivilians([civilianComplainant])
        .build();

      const wrapper = mount(
        <Provider store={store}>
          <Accused caseDetails={caseWithCivilianComplainant} classes={{}} />
        </Provider>
      );

      const complainantPanel = wrapper
        .find('[data-testid="complainantWitnessesPanel"]')
        .first();

      expect(complainantPanel.text()).toContain("Alpha");
      expect(complainantPanel.text()).toContain("not an officer");
    });

    describe("Manually Added Inmate Testing", () => {
      let caseInmate, caseWithMixedAccused, wrapper, inmatePanel;
      beforeEach(() => {
        caseInmate = new CaseInmate.Builder()
          .defaultCaseInmate()
          .withFirstName("Jeffrey")
          .withMiddleInitial("N")
          .withLastName("Winger")
          .withSuffix("III")
          .withNotFoundInmateId("A0662526")
          .withFacility("WCCC")
          .withNotes("Narcissistic Personality Disorder... definitely")
          .build();

        caseWithMixedAccused = new Case.Builder()
          .defaultCase()
          .withAccusedInmates([
            { ...caseInmate, fullName: "Jeffrey N Winger III" }
          ])
          .build();

        wrapper = mount(
          <Provider store={store}>
            <Accused caseDetails={caseWithMixedAccused} classes={{}} />
          </Provider>
        );

        inmatePanel = wrapper.find('[data-testid="inmate-panel"]').first();
      });

      test("should display manually added inmate accused", () => {
        expect(inmatePanel.text()).toContain("Jeffrey");
        expect(inmatePanel.text()).toContain("N");
        expect(inmatePanel.text()).toContain("Winger");
        expect(inmatePanel.text()).toContain("III");
        expect(inmatePanel.text()).toContain("A0662526");
        expect(inmatePanel.text()).toContain("WCCC");
        expect(inmatePanel.text()).toContain(
          "Narcissistic Personality Disorder... definitely"
        );
      });

      test("should display remove button and dispatch", () => {
        const inmatePanelRemoveButton = wrapper
          .find('[data-testid="removePersonInCustodyLink"]')
          .first();
        inmatePanelRemoveButton.simulate("click");

        expect(
          wrapper
            .find('[data-testid="confirmation-dialog-RemovePersoninCustody"]')
            .first()
            .text()
        ).toContain("Remove Person in Custody");
      });
    });
  });
});
