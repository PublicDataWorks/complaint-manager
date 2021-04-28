import CasesTable from "./CasesTable";
import React from "react";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import {
  getWorkingCasesSuccess,
  updateSort
} from "../../actionCreators/casesActionCreators";
import { BrowserRouter as Router } from "react-router-dom";
import Civilian from "../../../../sharedTestHelpers/civilian";
import {
  ASCENDING,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  DESCENDING,
  PERSON_TYPE,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import SortableCase from "../../testUtilities/SortableCase";
import getWorkingCases from "../thunks/getWorkingCases";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";
import Tag from "../../../../server/testHelpers/tag";

jest.mock("../thunks/getWorkingCases");

getWorkingCases.mockImplementation((sortBy, sortDirection, page) => ({
  type: "MOCK_GET_CASES_THUNK"
}));

describe("cases table", () => {
  let tableWrapper,
    cases,
    store,
    dispatchSpy,
    civilianChuck,
    civilianAriel,
    accusedOfficer,
    tagOne,
    caseOne;

  beforeEach(() => {
    getWorkingCases.mockClear();

    civilianChuck = {
      firstName: "Chuck",
      lastName: "Berry",
      personType: "Civilian"
    };

    civilianAriel = {
      firstName: "Ariel",
      lastName: "Pink",
      personType: "Civilian"
    };

    accusedOfficer = {
      firstName: "Jeff",
      lastName: "Wallace",
      personType: PERSON_TYPE.KNOWN_OFFICER
    };

    tagOne = new Tag.Builder().defaultTag().build();

    caseOne = new SortableCase.Builder()
      .defaultSortableCase()
      .withId(17)
      .withCaseReference("CC2017-0001")
      .withPrimaryComplainant(civilianChuck)
      .withComplaintType(CIVILIAN_INITIATED)
      .withStatus(CASE_STATUS.INITIAL)
      .withAssignedTo("tuser")
      .withPrimaryAccusedOfficer(accusedOfficer)
      .withFirstContactDate("2017-12-25")
      .withTagNames(["Use of Force", "Winter"])
      .build();

    const caseTwo = new SortableCase.Builder()
      .defaultSortableCase()
      .withId(24)
      .withCaseReference("CC2017-0002")
      .withPrimaryComplainant(civilianAriel)
      .withComplaintType(CIVILIAN_INITIATED)
      .withStatus(CASE_STATUS.READY_FOR_REVIEW)
      .withAssignedTo("tuser")
      .withFirstContactDate("2017-12-25")
      .build();

    cases = [caseOne, caseTwo];

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(getWorkingCasesSuccess(cases));
    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <CasesTable />
        </Router>
      </Provider>
    );
  });

  describe("table sorting", () => {
    test("should update sort by when case # number clicked", () => {
      const caseReferenceLabel = tableWrapper
        .find('[data-testid="caseReferenceSortLabel"]')
        .last();
      caseReferenceLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.CASE_REFERENCE,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.CASE_REFERENCE, ASCENDING)
      );

      caseReferenceLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.CASE_REFERENCE, DESCENDING)
      );
    });

    test("should update sort by when status clicked", () => {
      const caseReferenceLabel = tableWrapper
        .find('[data-testid="statusSortLabel"]')
        .last();
      caseReferenceLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.STATUS,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.STATUS, ASCENDING)
      );

      caseReferenceLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.STATUS, DESCENDING)
      );
    });

    test("should update sort by when complainant clicked", () => {
      const caseReferenceLabel = tableWrapper
        .find('[data-testid="complainantSortLabel"]')
        .last();
      caseReferenceLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.PRIMARY_COMPLAINANT,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.PRIMARY_COMPLAINANT, ASCENDING)
      );

      caseReferenceLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.PRIMARY_COMPLAINANT, DESCENDING)
      );
    });

    test("should update sort by when date clicked", () => {
      const caseReferenceLabel = tableWrapper
        .find('[data-testid="firstContactDateSortLabel"]')
        .last();
      caseReferenceLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.FIRST_CONTACT_DATE,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.FIRST_CONTACT_DATE, ASCENDING)
      );

      caseReferenceLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.FIRST_CONTACT_DATE, DESCENDING)
      );
    });
  });

  describe("column headers", () => {
    let caseReference,
      complaintType,
      status,
      complainant,
      firstContactDate,
      tags,
      assignedTo;

    beforeEach(() => {
      caseReference = tableWrapper.find('th[data-testid="casesNumberHeader"]');
      complaintType = tableWrapper.find(
        'th[data-testid="casesComplaintTypeHeader"]'
      );
      status = tableWrapper.find('th[data-testid="casesStatusHeader"]');
      complainant = tableWrapper.find(
        'th[data-testid="casesComplainantHeader"]'
      );
      firstContactDate = tableWrapper.find(
        'th[data-testid="casesFirstContactDateHeader"]'
      );
      assignedTo = tableWrapper.find('th[data-testid="casesAssignedToHeader"]');
      tags = tableWrapper.find('th[data-testid="casesTagsHeader"]');
    });

    test("should display tags", () => {
      expect(tags.text()).toEqual("Tags");
    });

    test("should display case reference", () => {
      expect(caseReference.text()).toEqual("Case #");
    });

    test("should display status", () => {
      expect(status.text()).toEqual("Status");
    });

    test("should display complainant", () => {
      expect(complainant.text()).toEqual(COMPLAINANT);
    });

    test("should display first contact date", () => {
      expect(firstContactDate.text()).toEqual("First Contact");
    });

    test("should display assigned to", () => {
      expect(assignedTo.text()).toEqual("Assigned To");
    });
  });

  describe("displaying a case", () => {
    let caseRow;

    beforeEach(() => {
      caseRow = tableWrapper.find('tr[data-testid="caseRow17"]');
    });

    test("should display case reference", () => {
      const number = caseRow.find('td[data-testid="caseReference"]');
      expect(number.text()).toEqual(caseOne.caseReference);
    });

    test("should display status", () => {
      const status = caseRow.find('td[data-testid="caseStatus"]');
      expect(status.text()).toEqual(CASE_STATUS.INITIAL);
    });

    test("should display name", () => {
      const name = caseRow.find('td[data-testid="caseName"]');
      expect(name.text()).toEqual("Chuck Berry");
    });

    test("should display accused officer", () => {
      const accusedOfficerName = caseRow.find(
        'td[data-testid="primaryAccusedOfficer"]'
      );
      expect(accusedOfficerName.text()).toEqual("Jeff Wallace");
    });

    test("should display first contact date", () => {
      const firstContactDate = caseRow.find(
        'td[data-testid="caseFirstContactDate"]'
      );
      expect(firstContactDate.text()).toEqual("Dec 25, 2017");
    });

    test("should display tags", () => {
      const tags = caseRow.find('td[data-testid="caseTags"]');
      expect(tags.text()).toEqual("Use of Force, Winter");
    });

    test("should display assigned to", () => {
      const assignedTo = caseRow.find('td[data-testid="caseAssignedTo"]');
      expect(assignedTo.text()).toEqual("TU");
    });

    test("should display multiple cases", () => {
      const otherCaseRow = tableWrapper.find('tr[data-testid="caseRow24"]');
      expect(otherCaseRow.exists()).toEqual(true);
    });
  });

  describe("table pagination", () => {
    test("should make an api call to get cases", () => {
      const casesTable = tableWrapper.find("CasesTable").instance();
      casesTable.onChange(12);

      expect(getWorkingCases).toHaveBeenCalledTimes(2);
      expect(getWorkingCases.mock.calls[1][2]).toEqual(12);
    });
  });

  describe("component mounting", () => {
    test("should mount case table with page 1", () => {
      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.CASE_REFERENCE,
        DESCENDING,
        1
      );
    });
  });
});
