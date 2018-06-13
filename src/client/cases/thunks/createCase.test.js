import nock from "nock";
import {
  closeCreateCaseDialog,
  createCaseFailure,
  createCaseSuccess,
  requestCaseCreation
} from "../../actionCreators/casesActionCreators";
import createCase from "./createCase";
import {push} from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("createCase", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
  });

  //TODO Can we remove it?
  test("should dispatch case creation requested action", () => {
    createCase()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(requestCaseCreation());
  });

  test("should dispatch success and close the dialog when case created successfully", async () => {
    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Fats",
          lastName: "Domino"
        }
      },
      redirect: false
    };

    const responseBody = {
      firstName: "Fats",
      lastName: "Domino",
      status: "Initial"
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

    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(closeCreateCaseDialog());
  });

  test("should dispatch failure when case creation fails", async () => {
    const caseDetails = {
      firstName: "Fats",
      lastName: "Domino"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/cases", caseDetails)
      .reply(500);

    await createCase(caseDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createCaseFailure());
  });

  test("should not dispatch success if unauthorized and redirect", async () => {
    const creationDetails = {};

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/cases", creationDetails.caseDetails)
      .reply(401);

    await createCase(creationDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect immediately if token missing", async () => {
    const responseBody = { cases: [] };
    getAccessToken.mockImplementationOnce(() => false);
    await createCase()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      createCaseSuccess(responseBody.cases)
    );
    expect(dispatch).toHaveBeenCalledWith(createCaseFailure());
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect to add officer if complainant is officer", async () => {
    const caseId = 12;

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Police",
          lastName: "Officer",
          complainantType: "Police Officer"
        }
      },
      redirect: true
    };

    const responseBody = {
      id: caseId,
      firstName: "Police",
      lastName: "Officer",
      status: "Initial"
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

    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      push(`/cases/${caseId}/officers/search?role=Complainant`)
    );
  });

  test("should redirect to case details if complainant is civilian", async () => {
    const caseId = 12;

    const creationDetails = {
      caseDetails: {
        case: {
          firstName: "Some",
          lastName: "Civilian",
          complainantType: "Civilian"
        }
      },
      redirect: true
    };

    const responseBody = {
      id: caseId,
      firstName: "Some",
      lastName: "Civilian",
      status: "Initial"
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

    expect(dispatch).toHaveBeenCalledWith(createCaseSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
