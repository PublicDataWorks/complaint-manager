import nock from "nock";
import { getWorkingCasesSuccess } from "../../actionCreators/casesActionCreators";
import {
  searchCasesInitiated,
  searchCasesSuccess,
  searchCasesFailed
} from "../../actionCreators/searchCasesActionCreators";
import getSearchCases from "./getSearchCases";
import getAccessToken from "../../../common/auth/getAccessToken";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { push } from "connected-react-router";
import { authEnabledTest } from "../../../testHelpers";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("getSearchCases", () => {
  describe("GET /cases/search", () => {
    const dispatch = jest.fn();
    const responseBody = {
      rows: [
        {
          id: "a case"
        }
      ],
      totalRecords: 1
    };
    const sortBy = "sortBy";
    const sortDirection = "sortDirection";
    const queryString = "queryString";

    beforeEach(() => {
      configureInterceptors({ dispatch });
      getAccessToken.mockClear();
      dispatch.mockClear();
    });

    test("should dispatch success when cases retrieved", async () => {
      nock("http://localhost")
        .get(
          `/api/cases/search?queryString=${queryString}&sortBy=${sortBy}&sortDirection=${sortDirection}&currentPage=1`
        )
        .reply(200, responseBody);

      await getSearchCases(queryString, sortBy, sortDirection)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(
        searchCasesSuccess(responseBody, 1)
      );
    });

    test("should dispatch failure when the backend errors out", async () => {
      console.error = jest.fn(() => true);

      nock("http://localhost")
        .get(
          `/api/cases/search?queryString=${queryString}&sortBy=${sortBy}&sortDirection=${sortDirection}&currentPage=1`
        )
        .reply(500, null);

      await getSearchCases(queryString, sortBy, sortDirection)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(searchCasesFailed());
    });
  });
});
