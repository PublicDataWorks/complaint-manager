import nock from "nock";
import { createCaseSuccess } from "../../actionCreators/casesActionCreators";
import createCase from "./createCase";
import { push } from "connected-react-router";
import {
  ASCENDING,
  CREATE_CASE_FORM_NAME,
  CASE_STATUS,
  COMPLAINANT,
  OFFICER_DETAILS_FORM_NAME,
  SORT_CASES_BY,
  SHOW_FORM
} from "../../../../sharedUtilities/constants";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getWorkingCases from "./getWorkingCases";
import { initialize, startSubmit, stopSubmit } from "redux-form";
import { closeCreateDialog } from "../../../common/actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../../common/actionCreators/dialogTypes";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

jest.mock("./getWorkingCases", () => (sortBy, sortDirection, page) => ({
  type: "MOCK_GET_WORKING_CASES",
  sortBy: sortBy,
  sortDirection: sortDirection,
  page: page
}));

const personTypes = [
  {
    key: "REDIRECT_TO_CASE_DETAILS",
    isEmployee: false,
    description: "Not an employee",
    dialogAction: SHOW_FORM
  },
  {
    key: "REDIRECT_TO_OTHER",
    isEmployee: true,
    employeeDescription: "Employee",
    dialogAction: "/redirect"
  }
];

describe("createCase", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success and close the dialog when case created successfully and no redirect", async () => {
    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Fats",
          lastName: "Domino",
          complainantType: "REDIRECT_TO_CASE_DETAILS"
        }
      },
      personType: personTypes[0],
      redirect: false,
      sorting: {
        sortBy: SORT_CASES_BY.CASE_REFERENCE,
        sortDirection: ASCENDING
      },
      pagination: {
        currentPage: 3
      }
    };

    const responseBody = {
      firstName: "Fats",
      lastName: "Domino",
      status: CASE_STATUS.INITIAL
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(201, responseBody);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(closeCreateDialog(DialogTypes.CASE));
    expect(dispatch).toHaveBeenCalledWith(
      getWorkingCases(SORT_CASES_BY.CASE_REFERENCE, ASCENDING, 3)
    );
  });

  test("should dispatch stop submit when case creation fails", async () => {
    const dispatch = jest.fn();
    configureInterceptors({ dispatch });

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Fats",
          lastName: "Domino"
        }
      },
      redirect: false,
      sorting: {
        sortBy: SORT_CASES_BY.CASE_REFERENCE,
        sortDirection: ASCENDING
      },
      pagination: {
        currentPage: 3
      }
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(503);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CREATE_CASE_FORM_NAME));
  });

  test("should redirect to /redirect if complainant so specifies", async () => {
    const caseId = 12;

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Police",
          lastName: "Officer",
          complainantType: "REDIRECT_TO_OTHER"
        }
      },
      personType: personTypes[1],
      redirect: true
    };

    const responseBody = {
      id: caseId,
      firstName: "Police",
      lastName: "Officer",
      status: CASE_STATUS.INITIAL
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(201, responseBody);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}/redirect`));
    expect(dispatch).toHaveBeenCalledWith(
      initialize(OFFICER_DETAILS_FORM_NAME, {
        roleOnCase: COMPLAINANT
      })
    );
  });

  test("should redirect to case details if complainant type shows the form on the dialog", async () => {
    const caseId = 12;

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Some",
          lastName: "Civilian",
          complainantType: "REDIRECT_TO_CASE_DETAILS"
        }
      },
      personType: personTypes[0],
      redirect: true
    };

    const responseBody = {
      id: caseId,
      firstName: "Some",
      lastName: "Civilian",
      status: CASE_STATUS.INITIAL
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(201, responseBody);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CREATE_CASE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
