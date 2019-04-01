import nock from "nock";
import { getWorkingCasesSuccess } from "../../actionCreators/casesActionCreators";
import getCases from "./getCases";
import getAccessToken from "../../auth/getAccessToken";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { push } from "connected-react-router";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getCases", () => {
  describe("GET /cases", () => {
    const dispatch = jest.fn();
    const responseBody = {
      cases: {
        rows: ["a case"],
        count: 1
      }
    };
    const sortBy = "sortBy";
    const sortDirection = "sortDirection";

    beforeEach(() => {
      configureInterceptors({ dispatch });
      getAccessToken.mockClear();
      dispatch.mockClear();
    });

    test("should dispatch success when cases retrieved", async () => {
      nock("http://localhost")
        .get(`/api/cases/all/${sortBy}/${sortDirection}`)
        .reply(200, responseBody);

      await getCases(sortBy, sortDirection)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        getWorkingCasesSuccess(
          responseBody.cases.rows,
          responseBody.cases.count
        )
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
        .get(`/api/cases/all/${sortBy}/${sortDirection}`)
        .reply(200, responseBody);

      await getCases(sortBy, sortDirection)(dispatch);

      expect(dispatch).not.toHaveBeenCalledWith(
        getWorkingCasesSuccess(
          responseBody.cases.rows,
          responseBody.cases.count
        )
      );
      expect(dispatch).toHaveBeenCalledWith(push(`/login`));
    });
  });
});
