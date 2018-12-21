import getSearchResults from "./getSearchResults";
import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { searchSuccess } from "../../actionCreators/searchActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken");

describe("getSearchResults", () => {
  const searchCriteria = {
    firstName: "Zoe",
    lastName: "Monster",
    district: "1st District"
  };
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const token = "token";
  const resourceToSearch = "resources";
  const page = 5;
  const queryParamsWithPagination = { ...searchCriteria, page };

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("dispatches failure when error response", async () => {
    nock("http://localhost/", {
      reqheaders: {
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/${resourceToSearch}/search`)
      .query(searchCriteria)
      .reply(500);
    getAccessToken.mockImplementation(() => token);
    await getSearchResults(searchCriteria, resourceToSearch)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the search was not completed. Please try again."
      )
    );
  });

  test("dispatches searchSuccess", async () => {
    const responseBody = [{ firstName: "Bob" }];
    nock("http://localhost/")
      .get(`/api/${resourceToSearch}/search`)
      .query(searchCriteria)
      .reply(200, responseBody);
    getAccessToken.mockImplementation(() => token);
    await getSearchResults(searchCriteria, resourceToSearch)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(searchSuccess(responseBody));
  });

  test("dispatches searchSuccess with pagination", async () => {
    const responseBody = [{ firstName: "Bob" }];
    nock("http://localhost/")
      .get(`/api/${resourceToSearch}/search`)
      .query(queryParamsWithPagination)
      .reply(200, responseBody);
    getAccessToken.mockImplementation(() => token);
    const paginating = true;
    await getSearchResults(searchCriteria, resourceToSearch, paginating, page)(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(searchSuccess(responseBody, page));
  });
});
