import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { push } from "connected-react-router";
import getArchivedCases from "./getArchivedCases";
import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getArchivedCases", () => {
  /*
NOTE: We should leave the order of these tests as they are. We basically need the missing token test which changes the getAccessToken mock implementation to be the last test which is run. This is because if we try to reset the mock, we lose the module level implementation needed by other tests

TODO: Look into ways to fix this
 */
  const dispatch = jest.fn();
  const responseBody = { cases: { rows: ["a case"], count: 1 } };
  const sortBy = "sortBy";
  const sortDirection = "sortDirection";

  beforeEach(() => {
    configureInterceptors({ dispatch });
    getAccessToken.mockClear();
    dispatch.mockClear();
  });

  test("should dispatch success when cases retrieved", async () => {
    nock("http://localhost")
      .get(`/api/cases/all/archived-cases/${sortBy}/${sortDirection}`)
      .reply(200, responseBody);

    await getArchivedCases(sortBy, sortDirection)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getArchivedCasesSuccess(responseBody.cases.rows, responseBody.cases.count)
    );
  });

  test("should dispatch with page when provided", async () => {
    const scope = nock("http://localhost")
      .get(`/api/cases/all/archived-cases/${sortBy}/${sortDirection}?page=2`)
      .reply(200, responseBody);

    await getArchivedCases(sortBy, sortDirection, 2)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getArchivedCasesSuccess(
        responseBody.cases.rows,
        responseBody.cases.count,
        2
      )
    );
    expect(scope.isDone()).toEqual(true);
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementation(() => false);

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer false`
      }
    })
      .get(`/api/cases/all/archived-cases/${sortBy}/${sortDirection}`)
      .reply(200, responseBody);

    await getArchivedCases(sortBy, sortDirection)(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getArchivedCasesSuccess(responseBody.cases.rows, responseBody.cases.count)
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });
});
