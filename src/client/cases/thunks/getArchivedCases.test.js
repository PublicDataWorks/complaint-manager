import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { push } from "connected-react-router";
import getArchivedCases from "./getArchivedCases";
import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getArchivedCases", () => {
  const dispatch = jest.fn();
  const responseBody = { cases: ["a case"] };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    getAccessToken.mockClear();
    dispatch.mockClear();
  });

  test("should dispatch success when cases retrieved", async () => {
    nock("http://localhost")
      .get("/api/cases/archived")
      .reply(200, responseBody);

    await getArchivedCases()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getArchivedCasesSuccess(responseBody.cases)
    );
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementation(() => false);

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer false`
      }
    })
      .get("/api/cases/archived")
      .reply(200, responseBody);

    await getArchivedCases()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getArchivedCasesSuccess(responseBody.cases)
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });
});
