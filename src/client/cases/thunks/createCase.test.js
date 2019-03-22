import nock from "nock";
import {
  closeCreateCaseDialog,
  createCaseFailure,
  createCaseSuccess,
  requestCaseCreation
} from "../../actionCreators/casesActionCreators";
import createCase from "./createCase";
import { push } from "connected-react-router";
import {
  ASCENDING,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  RANK_INITIATED,
  SORT_CASES_BY
} from "../../../sharedUtilities/constants";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getCases from "./getCases";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

jest.mock("./getCases", () => caseId => ({
  type: "MOCK_GET_WORKING_CASES",
  caseId
}));

describe("createCase", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  //TODO Can we remove it?
  test("should dispatch case creation requested action", () => {
    createCase()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(requestCaseCreation());
  });

  test("should dispatch success and close the dialog when case created successfully and no redirect", async () => {
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
      }
    };

    const responseBody = {
      firstName: "Fats",
      lastName: "Domino",
      status: CASE_STATUS.INITIAL
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(201, responseBody);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(closeCreateCaseDialog());
    expect(dispatch).toHaveBeenCalledWith(
      getCases(SORT_CASES_BY.CASE_REFERENCE, ASCENDING)
    );
  });

  test("should redirect to add officer if complainant is officer", async () => {
    const caseId = 12;

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Police",
          lastName: "Officer",
          complaintType: RANK_INITIATED
        }
      },
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
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(201, responseBody);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      push(`/cases/${caseId}/officers/search`)
    );
  });

  test("should redirect to case details if complainant is civilian", async () => {
    const caseId = 12;

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Some",
          lastName: "Civilian",
          complaintType: CIVILIAN_INITIATED
        }
      },
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
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(201, responseBody);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
