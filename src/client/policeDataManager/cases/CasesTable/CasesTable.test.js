import CasesTable, { validateQuotes } from "./CasesTable";
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
  CASE_TYPE,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  DESCENDING,
  SEARCH_CASES_SUCCESS,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import SortableCase from "../../testUtilities/SortableCase";
import getWorkingCases from "../thunks/getWorkingCases";
import getArchivedCases from "../thunks/getArchivedCases";
import getSearchCases from "../thunks/getSearchCases";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";
import Tag from "../../../../server/testHelpers/tag";
import { PERSON_TYPE } from "../../../../instance-files/constants";
import { crossOriginResourcePolicy } from "helmet";
import SearchCasesForm from "../SearchCases/SearchCasesForm";

jest.mock("../thunks/getWorkingCases");
jest.mock("../thunks/getArchivedCases");
jest.mock("../thunks/getSearchCases");

getWorkingCases.mockImplementation((sortBy, sortDirection, page) => ({
  type: "MOCK_GET_CASES_THUNK"
}));

getArchivedCases.mockImplementation((sortBy, sortDirection, page) => ({
  type: "MOCK_GET_CASES_THUNK"
}));

getSearchCases.mockImplementation(
  (queryString, sortBy, sortDirection, page) => ({
    type: "MOCK_GET_CASES_THUNK"
  })
);

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

    let accusedOfficer2 = {
      firstName: "William",
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
      .withAccusedOfficer(accusedOfficer)
      .withFirstContactDate("2017-12-25")
      .withTagNames(["cold-cut sandwich", "Grapes", "Use of Force"])
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

    const caseThree = new SortableCase.Builder()
      .defaultSortableCase()
      .withId(28)
      .withCaseReference("CC2017-0002")
      .withPrimaryComplainant(civilianAriel)
      .withComplaintType(CIVILIAN_INITIATED)
      .withStatus(CASE_STATUS.READY_FOR_REVIEW)
      .withAccusedOfficer(accusedOfficer)
      .withAccusedOfficer(accusedOfficer2)
      .withAssignedTo("tuser")
      .withFirstContactDate("2017-12-25")
      .build();

    cases = [caseOne, caseTwo, caseThree];

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    store.dispatch(getWorkingCasesSuccess(cases));
    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <CasesTable caseType={CASE_TYPE.WORKING} />
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

    test("should update sort by when tags clicked", () => {
      const caseReferenceLabel = tableWrapper
        .find('[data-testid="tagsSortLabel"]')
        .last();
      caseReferenceLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.TAGS,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.TAGS, ASCENDING)
      );

      caseReferenceLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.TAGS, DESCENDING)
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
        'td[data-testid="accusedOfficers"]'
      );
      expect(accusedOfficerName.text()).toEqual("Jeff Wallace");
    });

    test("should display multiple accused officers", () => {
      const lastRow = tableWrapper.find('tr[data-testid="caseRow28"]');
      const accusedOfficerName = lastRow.find(
        'td[data-testid="accusedOfficers"]'
      );
      expect(accusedOfficerName.text()).toEqual(
        "Jeff Wallace, William Wallace"
      );
    });

    test("should display first contact date", () => {
      const firstContactDate = caseRow.find(
        'td[data-testid="caseFirstContactDate"]'
      );
      expect(firstContactDate.text()).toEqual("Dec 25, 2017");
    });

    test("should display tags", () => {
      const tags = caseRow.find('td[data-testid="tagNames"]');
      expect(tags.text()).toEqual("cold-cut sandwich, Grapes, Use of Force");
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
});

describe("validateQuotes", () => {
  test("should return successfully if value is undefined", () => {
    expect(validateQuotes()).toBeUndefined();
  });

  test("should return error when quotation marks are unbalanced", () => {
    expect(validateQuotes('"Hello There" "General Kenobi')).not.toBeUndefined();
  });

  test("should return error when empty value between open and close quotation marks", () => {
    expect(validateQuotes('search "" search')).not.toBeUndefined();
    expect(validateQuotes('"search" search "" search')).not.toBeUndefined();
    expect(validateQuotes('"search""" search')).not.toBeUndefined();
  });

  test("should return error when whitespace only between open and close quotation marks", () => {
    expect(validateQuotes('search "     " search')).not.toBeUndefined();
    expect(
      validateQuotes('"search" search " \n   " search')
    ).not.toBeUndefined();
    expect(validateQuotes('"search""\t\t\t" search')).not.toBeUndefined();
  });

  test("should return successfully when there are no quotes", () => {
    expect(validateQuotes("Night Watch")).toBeUndefined();
  });

  test("should return successfully when quotes are balanced and no quote pairs have only whitespace", () => {
    expect(
      validateQuotes('"Night J Watch" "a cold cut sandwich" Hello')
    ).toBeUndefined();
  });
});

describe("component mounting", () => {
  let tableWrapper, store;

  test("should show search error message when there is no query string", () => {
    store = createConfiguredStore();
    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <CasesTable caseType={CASE_TYPE.SEARCH} />
        </Router>
      </Provider>
    );

    expect(
      tableWrapper.find("p[data-testid='searchResultsMessage']").text()
    ).toEqual("Invalid search, Please try again");
  });

  test("should show search error message when there is no query string", () => {
    store = createConfiguredStore();
    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <SearchCasesForm />
          <CasesTable caseType={CASE_TYPE.SEARCH} noCasesMessage="Noop!" />
        </Router>
      </Provider>
    );

    tableWrapper
      .find("[data-testid='searchField']")
      .simulate("change", { target: { value: "search term" } });
    tableWrapper.find("button[data-testid='searchButton']").simulate("click");

    setTimeout(() => {
      expect(
        tableWrapper.find("p[data-testid='searchResultsMessage']").text()
      ).toEqual("Noop!");
    }, 2000);
  });

  test("should mount working case table with page 1", () => {
    store = createConfiguredStore();
    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <CasesTable caseType={CASE_TYPE.WORKING} />
        </Router>
      </Provider>
    );

    expect(getWorkingCases).toHaveBeenCalledWith(
      SORT_CASES_BY.CASE_REFERENCE,
      DESCENDING,
      1
    );
  });

  test("should mount archived cases table with page 1", () => {
    store = createConfiguredStore();
    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <CasesTable caseType={CASE_TYPE.ARCHIVE} />
        </Router>
      </Provider>
    );

    expect(getArchivedCases).toHaveBeenCalledWith(
      SORT_CASES_BY.CASE_REFERENCE,
      DESCENDING,
      1
    );
  });

  test("should mount search cases table with page 1", () => {
    store = createConfiguredStore();
    const expectedQuery = "yay";

    const oldWindowLocation = window.location;
    delete window.location;
    window.location = new URL(
      `https://www.doesnt-matter.com?queryString=${expectedQuery}`
    );

    tableWrapper = mount(
      <Provider store={store}>
        <Router>
          <CasesTable caseType={CASE_TYPE.SEARCH} />
        </Router>
      </Provider>
    );

    expect(getSearchCases).toHaveBeenCalledWith(
      expectedQuery,
      SORT_CASES_BY.CASE_REFERENCE,
      DESCENDING,
      1
    );

    // Restores previous state of window location
    window.location = oldWindowLocation;
  });
});
