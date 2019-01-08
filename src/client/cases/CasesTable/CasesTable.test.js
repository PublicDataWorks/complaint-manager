import CasesTable from "./CasesTable";
import React from "react";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import {
  createCaseSuccess,
  getCasesSuccess,
  updateSort
} from "../../actionCreators/casesActionCreators";
import { BrowserRouter as Router } from "react-router-dom";
import Civilian from "../../testUtilities/civilian";
import Case from "../../testUtilities/case";
import CaseOfficer from "../../testUtilities/caseOfficer";
import Officer from "../../testUtilities/Officer";
import {
  CASE_STATUS,
  CIVILIAN_INITIATED,
  COMPLAINANT
} from "../../../sharedUtilities/constants";

jest.mock("../thunks/getCases", () => () => ({
  type: "MOCK_GET_CASES_THUNK"
}));

describe("cases table", () => {
  let tableWrapper,
    cases,
    store,
    dispatchSpy,
    civilianChuck,
    civilianAriel,
    officer,
    caseOne;

  beforeEach(() => {
    civilianChuck = new Civilian.Builder()
      .defaultCivilian()
      .withFirstName("Chuck")
      .withLastName("Berry")
      .withFullName("Chuck Berry")
      .withRoleOnCase(COMPLAINANT)
      .build();

    civilianAriel = new Civilian.Builder()
      .withFirstName("Ariel")
      .withLastName("Pink")
      .withRoleOnCase(COMPLAINANT)
      .build();

    officer = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jeff Wallace")
      .build();

    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officer)
      .build();

    caseOne = new Case.Builder()
      .defaultCase()
      .withId(17)
      .withComplainantCivilians([civilianChuck])
      .withComplaintType(CIVILIAN_INITIATED)
      .withStatus(CASE_STATUS.INITIAL)
      .withCreatedAt(new Date(2015, 8, 13).toISOString())
      .withAssignedTo("tuser")
      .withAccusedOfficers([accusedOfficer])
      .withFirstContactDate("2017-12-25")
      .build();
    const caseTwo = new Case.Builder()
      .defaultCase()
      .withId(24)
      .withComplainantCivilians([civilianAriel])
      .withComplaintType(CIVILIAN_INITIATED)
      .withStatus(CASE_STATUS.READY_FOR_REVIEW)
      .withCreatedAt(new Date().toISOString())
      .withAssignedTo("tuser")
      .withFirstContactDate("2017-12-25")
      .build();

    cases = [caseOne, caseTwo];

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(getCasesSuccess(cases));
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
      const caseNumberLabel = tableWrapper
        .find('[data-test="caseNumberSortLabel"]')
        .last();
      caseNumberLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(updateSort("id"));
    });

    test("should update sort by when status clicked", () => {
      const caseNumberLabel = tableWrapper
        .find('[data-test="statusSortLabel"]')
        .last();
      caseNumberLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(updateSort("status"));
    });

    test("should update sort by when complainant clicked", () => {
      const caseNumberLabel = tableWrapper
        .find('[data-test="complainantSortLabel"]')
        .last();
      caseNumberLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(updateSort("lastName"));
    });

    test("should update sort by when date clicked", () => {
      const caseNumberLabel = tableWrapper
        .find('[data-test="firstContactDateSortLabel"]')
        .last();
      caseNumberLabel.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(updateSort("firstContactDate"));
    });
  });

  describe("column headers", () => {
    let caseNumber,
      complaintType,
      status,
      complainant,
      firstContactDate,
      assignedTo;

    beforeEach(() => {
      caseNumber = tableWrapper.find('th[data-test="casesNumberHeader"]');
      complaintType = tableWrapper.find(
        'th[data-test="casesComplaintTypeHeader"]'
      );
      status = tableWrapper.find('th[data-test="casesStatusHeader"]');
      complainant = tableWrapper.find('th[data-test="casesComplainantHeader"]');
      firstContactDate = tableWrapper.find(
        'th[data-test="casesFirstContactDateHeader"]'
      );
      assignedTo = tableWrapper.find('th[data-test="casesAssignedToHeader"]');
    });

    test("should display case number", () => {
      expect(caseNumber.text()).toEqual("Case #");
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
      caseRow = tableWrapper.find('tr[data-test="caseRow17"]');
    });

    test("should display case number", () => {
      const number = caseRow.find('td[data-test="caseNumber"]');
      expect(number.text()).toEqual(caseOne.caseNumber);
    });

    test("should display status", () => {
      const status = caseRow.find('td[data-test="caseStatus"]');
      expect(status.text()).toEqual(CASE_STATUS.INITIAL);
    });

    test("should display name", () => {
      const name = caseRow.find('td[data-test="caseName"]');
      expect(name.text()).toEqual("Chuck Berry");
    });

    test("should display accused officer", () => {
      const accusedOfficerName = caseRow.find('td[data-test="accusedOfficer"]');
      expect(accusedOfficerName.text()).toEqual(officer.fullName);
    });

    test("should display first contact date", () => {
      const firstContactDate = caseRow.find(
        'td[data-test="caseFirstContactDate"]'
      );
      expect(firstContactDate.text()).toEqual("Dec 25, 2017");
    });

    test("should display assigned to", () => {
      const assignedTo = caseRow.find('td[data-test="caseAssignedTo"]');
      expect(assignedTo.text()).toEqual("tuser");
    });

    test("should display an open case button", () => {
      const openCaseButton = caseRow.find('[data-test="openCaseButton"]');
      expect(openCaseButton.exists()).toEqual(true);
    });

    test("open case button should refer to the case detail page", () => {
      const openCaseButton = caseRow.find('a[data-test="openCaseButton"]');
      expect(openCaseButton.prop("href")).toEqual("/cases/17");
    });

    test("should display multiple cases", () => {
      const otherCaseRow = tableWrapper.find('tr[data-test="caseRow24"]');
      expect(otherCaseRow.exists()).toEqual(true);
    });

    test("should remain in numeric descending order by case # after creation", () => {
      const yetAnotherCase = new Case.Builder()
        .defaultCase()
        .withId(50)
        .withComplainantCivilians([civilianChuck])
        .withStatus(CASE_STATUS.INITIAL)
        .withComplaintType(CIVILIAN_INITIATED)
        .withCreatedAt(new Date(2015, 8, 15).toISOString())
        .withAssignedTo("tuser")
        .withFirstContactDate("2017-12-25")
        .build();

      store.dispatch(createCaseSuccess(yetAnotherCase));
      tableWrapper.update();

      const rows = tableWrapper.find("TableBody").find("TableRow");
      const firstRow = rows.at(0);

      expect(
        firstRow
          .find("TableCell")
          .at(0)
          .text()
      ).toEqual(`${yetAnotherCase.caseNumber}`);
    });
  });
});
