import CasesTable, {
  validateQuotes,
  areSearchOperatorsValid
} from "./CasesTable";
import React from "react";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../createConfiguredStore";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitFor } from '@testing-library/react';
import {
  getWorkingCasesSuccess,
  updateSort
} from "../../actionCreators/casesActionCreators";
import {
  ASCENDING,
  CASE_STATUS,
  CASE_TYPE,
  CIVILIAN_INITIATED,
  COMPLAINANT,
  DESCENDING,
  SORT_CASES_BY,
  WORKING
} from "../../../../sharedUtilities/constants";
import Tag from "../../../../server/testHelpers/tag";
import SearchCasesForm from "../SearchCases/SearchCasesForm";
import SortableCase from "../../testUtilities/SortableCase";
import getWorkingCases from "../thunks/getWorkingCases";
import getArchivedCases from "../thunks/getArchivedCases";
import getSearchCases from "../thunks/getSearchCases";
import { getUsers } from '../../../../auth/okta/userService';

jest.mock('../../../../auth/okta/userService', () => ({
  getUsers: jest.fn(),
}));
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
      personType: "Officer"
    };

    let accusedOfficer2 = {
      firstName: "William",
      lastName: "Wallace",
      personType: "Officer"
    };

    tagOne = new Tag.Builder().defaultTag().build();

    caseOne = new SortableCase.Builder()
      .defaultSortableCase()
      .withId(17)
      .withCaseReference("CC2017-0001")
      .withPrimaryComplainant(civilianChuck)
      .withStatus(CASE_STATUS.INITIAL)
      .withAssignedTo("tuser")
      .withAccusedOfficer(accusedOfficer)
      .withFirstContactDate("2017-12-25")
      .withTagNames(["cold-cut sandwich", "Grapes", "Use of Force"])
      .build();

    caseOne.complaintType = CIVILIAN_INITIATED;

    const caseTwo = new SortableCase.Builder()
      .defaultSortableCase()
      .withId(24)
      .withCaseReference("CC2017-0002")
      .withPrimaryComplainant(civilianAriel)
      .withStatus(CASE_STATUS.READY_FOR_REVIEW)
      .withAssignedTo("tuser")
      .withFirstContactDate("2017-12-25")
      .build();

    caseTwo.complaintType = CIVILIAN_INITIATED;

    const caseThree = new SortableCase.Builder()
      .defaultSortableCase()
      .withId(28)
      .withCaseReference("CC2017-0002")
      .withPrimaryComplainant(civilianAriel)
      .withStatus(CASE_STATUS.READY_FOR_REVIEW)
      .withAccusedOfficer(accusedOfficer)
      .withAccusedOfficer(accusedOfficer2)
      .withAssignedTo("tuser")
      .withFirstContactDate("2017-12-25")
      .build();

    caseThree.complaintType = CIVILIAN_INITIATED;

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
        updateSort(SORT_CASES_BY.CASE_REFERENCE, ASCENDING, WORKING)
      );
    });

    test("should update sort by when status clicked", () => {
      const statusLabel = tableWrapper
        .find('[data-testid="statusSortLabel"]')
        .last();
      statusLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.STATUS,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.STATUS, ASCENDING, WORKING)
      );
    });

    test("should update sort by when complainant clicked", () => {
      const complainantLabel = tableWrapper
        .find('[data-testid="complainantSortLabel"]')
        .last();
      complainantLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.PRIMARY_COMPLAINANT,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.PRIMARY_COMPLAINANT, ASCENDING, WORKING)
      );
    });

    test("should update sort by when date clicked", () => {
      const firstContactDateLabel = tableWrapper
        .find('[data-testid="firstContactDateSortLabel"]')
        .last();
      firstContactDateLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.FIRST_CONTACT_DATE,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.FIRST_CONTACT_DATE, ASCENDING, WORKING)
      );
    });

    test("should update sort by when tags clicked", () => {
      const tagsLabel = tableWrapper
        .find('[data-testid="tagsSortLabel"]')
        .last();
      tagsLabel.simulate("click");

      expect(getWorkingCases).toHaveBeenCalledWith(
        SORT_CASES_BY.TAGS,
        ASCENDING,
        1
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        updateSort(SORT_CASES_BY.TAGS, ASCENDING, WORKING)
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
      caseReference = tableWrapper.find(
        'th[data-testid="caseReferenceHeader"]'
      );
      complaintType = tableWrapper.find(
        'th[data-testid="casesComplaintTypeHeader"]'
      );
      status = tableWrapper.find('th[data-testid="statusHeader"]');
      complainant = tableWrapper.find('th[data-testid="complainantHeader"]');
      firstContactDate = tableWrapper.find(
        'th[data-testid="firstContactDateHeader"]'
      );
      assignedTo = tableWrapper.find('th[data-testid="casesAssignedToHeader"]');
      tags = tableWrapper.find('th[data-testid="tagsHeader"]');
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

    test("should display assigned to", async () => {
      getUsers.mockResolvedValue([
        { email: 'someone@gmail.com', name: 'Tom Upton' },
      ]);
      const assignedTo = caseRow.find('td[data-testid="caseAssignedTo"]');
      expect(assignedTo.exists()).toEqual(true);    
      // expect(assignedTo.text()).toEqual("TU");

      // // render(<CasesTable />);
      // const caseRow = await screen.findByTestId("caseAssignedTo");
      await waitFor(() => {
        expect(assignedTo.text()).toEqual("TU")
      });
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

describe("areSearchOperatorsValid", () => {
  test("should accept a queryString with no operators", () => {
    expect(areSearchOperatorsValid("beauty and")).toBeTrue();
  });

  test("should accept a queryString with a single AND in between terms", () => {
    expect(areSearchOperatorsValid('beauty AND "the beast"')).toBeTrue();
  });

  test("should reject a queryString that starts with AND", () => {
    expect(areSearchOperatorsValid("AND the beast")).toBeFalse();
  });

  test("should accept a queryString that starts with NOT", () => {
    expect(areSearchOperatorsValid('NOT "the beast"')).toBeTrue();
  });

  test("should reject a queryString that ends with OR", () => {
    expect(areSearchOperatorsValid("Beauty OR")).toBeFalse();
  });

  test("should reject a queryString that ends with NOT", () => {
    expect(areSearchOperatorsValid("That looks good, NOT")).toBeFalse();
  });

  test("should accept multiple operators separated by search terms with no parentheses", () => {
    expect(
      areSearchOperatorsValid("so AND then OR then AND then OR then")
    ).toBeTrue();
  });

  test("should reject AND and OR when adjacent", () => {
    expect(areSearchOperatorsValid("this AND OR that")).toBeFalse();
  });

  test("should accept multiple operators separated by search terms with parentheses", () => {
    expect(
      areSearchOperatorsValid("(hot AND dry) OR (cool AND moist)")
    ).toBeTrue();
  });

  test("should reject AND at the end of a parenthesis", () => {
    expect(
      areSearchOperatorsValid("(hot AND) dry OR (cool AND moist)")
    ).toBeFalse();
  });

  test("should accept AND followed by NOT followed by term", () => {
    expect(areSearchOperatorsValid("cute AND NOT creepy")).toBeTrue();
  });

  test("should not reject anything in quotes", () => {
    expect(areSearchOperatorsValid('"NOT AND OR OR AND NOT"')).toBeTrue();
  });

  test("should reject an invalid operator even if there is a quote elsewhere in the string", () => {
    expect(areSearchOperatorsValid('AND "Hi everybody"')).toBeFalse();
  });

  test("should accept field searches as long as everything is in order", () => {
    expect(
      areSearchOperatorsValid(
        "tag:Tofu AND (complainant:Night OR accused:Watch)"
      )
    ).toBeTrue();
  });

  test("should reject field searches for fields that don't exist", () => {
    expect(areSearchOperatorsValid("sanity:zero")).toBeFalse();
    expect(areSearchOperatorsValid("(sanity:zero AND hope)")).toBeFalse();
  });

  test("should reject words with multiple colons", () => {
    expect(areSearchOperatorsValid("tag:Tofu:isGross")).toBeFalse();
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
          <CasesTable
            caseType={CASE_TYPE.WORKING}
            sortBy={SORT_CASES_BY.CASE_REFERENCE}
            sortDirection={DESCENDING}
            currentPage={1}
          />
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
          <CasesTable
            caseType={CASE_TYPE.ARCHIVE}
            sortBy={SORT_CASES_BY.CASE_REFERENCE}
            sortDirection={DESCENDING}
            currentPage={1}
          />
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
          <CasesTable
            caseType={CASE_TYPE.SEARCH}
            sortBy={SORT_CASES_BY.CASE_REFERENCE}
            sortDirection={DESCENDING}
            currentPage={1}
          />
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
