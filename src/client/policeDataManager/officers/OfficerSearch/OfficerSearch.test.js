import OfficerSearch from "./OfficerSearch";
import { OFFICER_TITLE } from "../../../../sharedUtilities/constants";
import { mount } from "enzyme";
import React from "react";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("OfficerSearch test", () => {
  let store, mockPath;
  beforeEach(() => {
    store = createConfiguredStore();
    mockPath = "mockPath";
  });

  test("Should display Officer in title and unknown officer link when searching for an officer", () => {
    const officerSearch = mount(
      <Provider store={store}>
        <Router>
          <OfficerSearch
            employeeSearchTitle={OFFICER_TITLE}
            caseEmployeeType={PERSON_TYPE.UNKNOWN_OFFICER.employeeDescription}
            path={mockPath}
          />
        </Router>
      </Provider>
    );

    const officerSearchTitle = officerSearch
      .find('[data-testid="search-page-header"]')
      .first();

    const unknownOfficerLink = officerSearch
      .find('[data-testid="unknown-officer-link"]')
      .first();

    expect(officerSearchTitle.text()).toEqual(`Search for an ${OFFICER_TITLE}`);
    expect(unknownOfficerLink.text()).toEqual(
      "Unable to find an officer? You can Add an Unknown Officer and identify them later."
    );
  });

  test("Should display Employee in title and hide unknown officer link when searching for a civilian within PD", () => {
    const officerSearch = mount(
      <Provider store={store}>
        <Router>
          <OfficerSearch
            employeeSearchTitle="Civilian (LMNOPD)"
            caseEmployeeType={
              PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription
            }
            path={mockPath}
          />
        </Router>
      </Provider>
    );

    const officerSearchTitle = officerSearch
      .find('[data-testid="search-page-header"]')
      .first();

    const unknownOfficerLink = officerSearch
      .find('[data-testid="unknown-officer-link"]')
      .first();

    expect(officerSearchTitle.text()).toEqual(`Search for a Civilian (LMNOPD)`);
    expect(unknownOfficerLink).toEqual({});
  });
});
